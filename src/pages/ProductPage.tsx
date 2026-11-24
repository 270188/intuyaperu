import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../lib/cart";
import { money, waLink } from "../lib/config";
import { CATEGORIES, getProduct, PRODUCTS } from "../lib/products";
import NotFound from "./NotFound";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const p = getProduct(slug);
  const { add, items } = useCart();
  const [size, setSize] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setSize("");
    setMsg("");
    if (p) document.title = `${p.name} · INTUYA PERÚ`;
  }, [p]);

  if (!p) return <NotFound />;

  const cat = CATEGORIES.find((c) => c.id === p.category);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const stock = p.sizes.find((s) => s.size === size)?.stock ?? 0;
  const inCart = items.find((i) => i.id === p.id && i.size === size)?.qty ?? 0;

  function addToBag() {
    if (!size) return setMsg("Elige una talla");
    if (inCart >= stock) return setMsg("Ya tienes todas las unidades disponibles de esta talla");
    add(p!.id, size);
    setMsg("");
  }

  return (
    <div className="pdp">
      <div className="pdp-media">
        {p.images.map((src, i) => (
          <img key={src} src={src} alt={`${p.name} color ${p.color}${i ? `, vista ${i + 1}` : ""}`} width={900} height={1200} fetchPriority={i === 0 ? "high" : "auto"} loading={i === 0 ? "eager" : "lazy"} />
        ))}
      </div>
      <div className="pdp-info">
        <nav className="crumbs"><Link to="/tienda">Tienda</Link> / <Link to={`/tienda?categoria=${p.category}`}>{cat?.label}</Link></nav>
        <h1>{p.name}</h1>
        <p className="pdp-price">
          {p.compareAt && <s>{money(p.compareAt)}</s>} {money(p.price)}
        </p>
        <p className="muted">Color: {p.color}</p>

        <fieldset className="sizes">
          <legend>Talla</legend>
          {p.sizes.map((s) => (
            <button
              key={s.size}
              className={size === s.size ? "size on" : "size"}
              disabled={s.stock === 0}
              onClick={() => { setSize(s.size); setMsg(""); }}
              aria-pressed={size === s.size}
              title={s.stock === 0 ? "Agotado" : s.stock <= 2 ? "Últimas unidades" : ""}
            >
              {s.size}
            </button>
          ))}
        </fieldset>
        {size && stock <= 2 && <p className="warn">¡Últimas {stock} unidades!</p>}
        {msg && <p className="warn" role="alert">{msg}</p>}

        <button className="btn block" onClick={addToBag}>Añadir a la bolsa</button>
        <a className="btn ghost block" href={waLink(`Hola, me interesa: ${p.name} (${p.color})${size ? ` talla ${size}` : ""}. ¿Está disponible?`)} target="_blank" rel="noopener noreferrer">
          Consultar por WhatsApp
        </a>

        <details open>
          <summary>Descripción</summary>
          <p>{p.description}</p>
        </details>
        <details>
          <summary>Composición y cuidado</summary>
          <p>{p.material}. Lavar a mano o en ciclo delicado con agua fría. No usar secadora.</p>
        </details>
        <details>
          <summary>Envíos y cambios</summary>
          <p>Envíos a Lima en 24 a 72 h y a provincias en 3 a 7 días. Cambios hasta 7 días después de recibir tu pedido. <Link to="/legal/cambios">Ver política</Link>.</p>
        </details>
      </div>

      {related.length > 0 && (
        <section className="section related">
          <div className="section-head"><h2>También te puede gustar</h2></div>
          <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
