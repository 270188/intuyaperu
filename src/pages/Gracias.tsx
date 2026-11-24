import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../lib/cart";
import { money, PAYMENT_INFO, waLink } from "../lib/config";
import { loadOrder } from "../lib/order";

export default function Gracias() {
  const [sp] = useSearchParams();
  const { clear } = useCart();
  const order = loadOrder();
  const mp = sp.get("mp"); // success | failure | pending (vuelta de Mercado Pago)

  useEffect(() => {
    if (mp === "success" || mp === "pending") clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mp]);

  if (mp === "failure")
    return (
      <div className="page narrow center">
        <h1>El pago no se completó</h1>
        <p className="muted">No se hizo ningún cobro. Puedes intentarlo otra vez o pagar con Yape, Plin o transferencia.</p>
        <Link to="/checkout" className="btn">Volver a intentar</Link>
      </div>
    );

  if (!order)
    return (
      <div className="page narrow center">
        <h1>¡Gracias por tu compra!</h1>
        <Link to="/tienda" className="btn">Seguir comprando</Link>
      </div>
    );

  const resumen = [
    `Hola Intuya Perú 👋, acabo de hacer el pedido *${order.id}*`,
    ...order.lines.map((l) => `• ${l.name} · Talla ${l.size} · x${l.qty} · ${money(l.price * l.qty)}`),
    `Envío: ${order.envio ? money(order.envio) : "Gratis"}`,
    `*Total: ${money(order.total)}*`,
    `Pago: ${order.metodo}`,
    `Nombre: ${order.buyer.nombre} · DNI/CE: ${order.buyer.documento}`,
    `Dirección: ${order.buyer.direccion}${order.buyer.referencia ? ` (${order.buyer.referencia})` : ""}`,
    order.metodo === "tarjeta" ? "" : "Adjunto mi comprobante de pago.",
  ].filter(Boolean).join("\n");

  const pagado = order.metodo === "tarjeta" && mp === "success";

  return (
    <div className="page narrow">
      <p className="eyebrow">Pedido {order.id}</p>
      <h1>{pagado ? "¡Pago aprobado, gracias!" : mp === "pending" ? "Tu pago está en proceso" : "¡Pedido recibido!"}</h1>

      {order.metodo !== "tarjeta" && (
        <div className="pay-box">
          <h2>Último paso: realiza tu pago de {money(order.total)}</h2>
          {(order.metodo === "yape" || order.metodo === "plin") && (
            <p>Envía el pago por <strong>{order.metodo === "yape" ? "Yape" : "Plin"}</strong> al <strong>{PAYMENT_INFO.yapePlin.numero}</strong> ({PAYMENT_INFO.yapePlin.titular}).</p>
          )}
          {order.metodo === "transferencia" && (
            <ul>
              {PAYMENT_INFO.transferencia.map((t) => (
                <li key={t.banco}><strong>{t.banco}</strong>: {t.cuenta} · CCI {t.cci}</li>
              ))}
            </ul>
          )}
          <p className="muted">Luego envíanos la captura por WhatsApp. Reservamos tus prendas por 24 horas.</p>
        </div>
      )}

      <a className="btn block" href={waLink(resumen)} target="_blank" rel="noopener noreferrer">
        {order.metodo === "tarjeta" ? "Confirmar pedido por WhatsApp" : "Enviar comprobante por WhatsApp"}
      </a>

      <h2>Resumen</h2>
      <ul className="plain">
        {order.lines.map((l, i) => <li key={i}>{l.name} · Talla {l.size} · x{l.qty} — {money(l.price * l.qty)}</li>)}
      </ul>
      <div className="row"><span>Envío</span><span>{order.envio ? money(order.envio) : "Gratis"}</span></div>
      <div className="row total"><span>Total</span><strong>{money(order.total)}</strong></div>
      <Link to="/tienda" className="btn ghost block">Seguir comprando</Link>
    </div>
  );
}
