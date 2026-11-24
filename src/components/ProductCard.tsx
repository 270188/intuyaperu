import { Link } from "react-router-dom";
import { money } from "../lib/config";
import { totalStock, type Product } from "../lib/products";

export default function ProductCard({ p, eager = false }: { p: Product; eager?: boolean }) {
  const agotado = totalStock(p) === 0;
  return (
    <Link to={`/producto/${p.slug}`} className="card">
      <div className="card-img">
        <img src={p.thumb} srcSet={`${p.thumb} 450w, ${p.image} 900w`} sizes="(max-width: 760px) 50vw, 25vw" alt={`${p.name} color ${p.color}`} width={450} height={600} loading={eager ? "eager" : "lazy"} decoding="async" />
        {p.isNew && <span className="tag">Nuevo</span>}
        {p.compareAt && <span className="tag sale">-{Math.round((1 - p.price / p.compareAt) * 100)}%</span>}
        {agotado && <span className="tag out">Agotado</span>}
      </div>
      <div className="card-info">
        <span className="card-name">{p.name}</span>
        <span className="card-price">
          {p.compareAt && <s>{money(p.compareAt)}</s>} {money(p.price)}
        </span>
      </div>
    </Link>
  );
}
