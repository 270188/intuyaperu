import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { money } from "../lib/config";

export default function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();
  if (items.length === 0)
    return (
      <div className="page narrow center">
        <h1>Tu bolsa está vacía</h1>
        <Link to="/tienda" className="btn">Ver colección</Link>
      </div>
    );
  return (
    <div className="page narrow">
      <h1>Bolsa</h1>
      <ul className="lines">
        {items.map((it) => (
          <li key={it.id + it.size} className="line">
            <img src={it.product.thumb} alt="" width={80} height={107} loading="lazy" />
            <div className="line-info">
              <Link to={`/producto/${it.product.slug}`}>{it.product.name}</Link>
              <span className="muted">Talla {it.size} · {it.product.color}</span>
              <div className="qty">
                <button onClick={() => setQty(it.id, it.size, it.qty - 1)} disabled={it.qty <= 1} aria-label="Restar">−</button>
                <span>{it.qty}</span>
                <button onClick={() => setQty(it.id, it.size, it.qty + 1)} disabled={it.qty >= it.max} aria-label="Sumar">+</button>
              </div>
            </div>
            <div className="line-right">
              <span>{money(it.qty * it.product.price)}</span>
              <button className="link" onClick={() => remove(it.id, it.size)}>Quitar</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="row total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
      <Link to="/checkout" className="btn block">Finalizar compra</Link>
    </div>
  );
}
