import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, PRODUCTS } from "../lib/products";

// Cada foto aparece una sola vez en la portada: portada, categorías y novedades no se repiten.
const HERO = ["blusa-guipur-camel", "vestido-midi-tropical", "blusa-romantica-perlas"];

const catSlug: Record<string, string> = {
  blusas: "blusa-lazo-amarilla",
  blazers: "chaqueta-cierres-dorados",
  conjuntos: "conjunto-tweed",
  pantalones: "jean-flare-botones",
  faldas: "falda-jean-correa-oscura",
  vestidos: "vestido-camisero-correa",
  tejidos: "polo-tejido-rayas",
};

export default function Home() {
  const used = new Set([...HERO, ...Object.values(catSlug)]);
  const nuevos = PRODUCTS.filter((p) => p.isNew && !used.has(p.slug)).slice(0, 8);
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          {HERO.map((slug, i) => (
            <img key={slug} src={`/productos/${slug}.webp`} alt="" width={900} height={1200} fetchPriority={i === 0 ? "high" : "auto"} className={i === 2 ? "hide-sm" : undefined} />
          ))}
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
              <img src={`/productos/${catSlug[c.id]}-sm.webp`} alt="" width={400} height={533} loading="lazy" />
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
