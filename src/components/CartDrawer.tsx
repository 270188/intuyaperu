import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { money } from "../lib/config";
import { FREE_SHIPPING_FROM } from "../lib/shipping";

export default function CartDrawer() {
  const { items, subtotal, open, setOpen, setQty, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  const falta = FREE_SHIPPING_FROM - subtotal;

  return (
    <div className={open ? "drawer-wrap open" : "drawer-wrap"} onClick={() => setOpen(false)} aria-hidden={!open}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Tu bolsa">
        <div className="drawer-head">
          <h2>Bolsa</h2>
          <button className="text-btn" onClick={() => setOpen(false)}>Cerrar</button>
        </div>
        {items.length === 0 ? (
          <div className="empty">
            <p>Tu bolsa está vacía.</p>
            <Link to="/tienda" className="btn" onClick={() => setOpen(false)}>Ver colección</Link>
          </div>
        ) : (
          <>
            <p className="ship-note">{falta > 0 ? `Te faltan ${money(falta)} para envío gratis en Lima` : "¡Tienes envío gratis en Lima!"}</p>
            <ul className="lines">
              {items.map((it) => (
                <li key={it.id + it.size} className="line">
                  <img src={it.product.thumb} alt="" width={80} height={107} loading="lazy" />
                  <div className="line-info">
                    <Link to={`/producto/${it.product.slug}`} onClick={() => setOpen(false)}>{it.product.name}</Link>
                    <span className="muted">Talla {it.size} · {it.product.color}</span>
                    <div className="qty">
                      <button onClick={() => setQty(it.id, it.size, it.qty - 1)} aria-label="Restar" disabled={it.qty <= 1}>−</button>
                      <span>{it.qty}</span>
                      <button onClick={() => setQty(it.id, it.size, it.qty + 1)} aria-label="Sumar" disabled={it.qty >= it.max}>+</button>
                    </div>
                  </div>
                  <div className="line-right">
                    <span>{money(it.qty * it.product.price)}</span>
                    <button className="link" onClick={() => remove(it.id, it.size)}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <div className="row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              <Link to="/checkout" className="btn block" onClick={() => setOpen(false)}>Finalizar compra</Link>
              <Link to="/carrito" className="btn ghost block" onClick={() => setOpen(false)}>Ver bolsa</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
