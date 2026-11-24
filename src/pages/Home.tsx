import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, PRODUCTS } from "../lib/products";

const catImage: Record<string, string> = {
  blusas: "/productos/blusa-guipur-camel-sm.webp",
  blazers: "/productos/blazer-beige-sm.webp",
  conjuntos: "/productos/conjunto-tweed-sm.webp",
  pantalones: "/productos/jean-wide-leg-azul-sm.webp",
  faldas: "/productos/falda-jean-correa-oscura-sm.webp",
  vestidos: "/productos/vestido-midi-tropical-sm.webp",
  tejidos: "/productos/chompa-calada-negra-sm.webp",
};

export default function Home() {
  const nuevos = PRODUCTS.filter((p) => p.isNew).slice(0, 8);
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <img src="/productos/conjunto-tweed.webp" alt="" width={900} height={1200} fetchPriority="high" />
          <img src="/productos/blusa-guipur-camel.webp" alt="" width={900} height={1200} />
          <img src="/productos/blusa-romantica-perlas.webp" alt="" width={900} height={1200} className="hide-sm" />
        </div>
        <div className="hero-text">
          <p className="eyebrow">Nueva colección</p>
          <h1>Elegancia que se siente</h1>
          <Link to="/tienda?nuevo=1" className="btn light">Descubrir</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Novedades</h2>
          <Link to="/tienda?nuevo=1" className="link">Ver todo</Link>
        </div>
        <div className="grid">
          {nuevos.map((p, i) => <ProductCard key={p.id} p={p} eager={i < 4} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Categorías</h2></div>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/tienda?categoria=${c.id}`} className="cat">
              <img src={catImage[c.id]} alt="" width={400} height={533} loading="lazy" />
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="perks">
        <div><strong>Envíos a todo el Perú</strong><span>Lima en 24 a 72 h</span></div>
        <div><strong>Pago 100% seguro</strong><span>Tarjetas, Yape, Plin y transferencia</span></div>
        <div><strong>Cambios fáciles</strong><span>Hasta 7 días después de recibir</span></div>
      </section>
    </>
  );
}
