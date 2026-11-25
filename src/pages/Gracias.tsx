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
    `Hola Maison Inti 👋, acabo de hacer el pedido *${order.id}*`,
    ...order.lines.map((l) => `• ${l.name} · Talla ${l.size} · x${l.qty} · ${money(l.price * l.qty)}`),
    `Envío: ${order.envio ? money(order.envio) : "Gratis"}`,
    order.comision ? `Comisión tarjeta (5%): ${money(order.comision)}` : "",
    `*Total: ${money(order.total)}*`,
    `Pago: ${order.metodo}`,
    `Nombre: ${order.buyer.nombre} · DNI/CE: ${order.buyer.documento}`,
    `Dirección: ${order.buyer.direccion}${order.buyer.referencia ? ` (${order.buyer.referencia})` : ""}`,
    "Adjunto mi comprobante de pago.",
  ].filter(Boolean).join("\n");

  const pagado = order.metodo === "tarjeta" && mp === "success";

  return (
    <div className="page narrow">
      <p className="eyebrow">Pedido {order.id}</p>
      <h1>{pagado ? "¡Pago aprobado, gracias!" : mp === "pending" ? "Tu pago está en proceso" : "¡Pedido recibido!"}</h1>

      {order.metodo === "tarjeta" && !mp && (
        <div className="pay-box">
          <h2>Último paso: paga {money(order.total)} con tarjeta</h2>
          <p>Toca el botón, escribe el monto exacto de <strong>{money(order.total)}</strong>, ya incluye el 5% de comisión por pago con tarjeta, elige tu tarjeta (Visa, Mastercard, American Express o Diners) y ¡listo!</p>
          <a className="btn block" href={PAYMENT_INFO.mercadoPagoLink} target="_blank" rel="noopener noreferrer">Pagar con Mercado Pago</a>
          <p className="muted">Luego envíanos la captura del pago por WhatsApp con tu número de pedido. Reservamos tus prendas por 24 horas.</p>
        </div>
      )}

      {order.metodo !== "tarjeta" && (
        <div className="pay-box">
          <h2>Último paso: realiza tu pago de {money(order.total)}</h2>
          {(order.metodo === "yape" || order.metodo === "plin") && (
            <>
              <p>Escanea el QR o envía el pago por <strong>{order.metodo === "yape" ? "Yape" : "Plin"}</strong> al <strong>{PAYMENT_INFO.yapePlin.numero}</strong>, a nombre de <strong>{PAYMENT_INFO.yapePlin.titular}</strong>.</p>
              <img className="qr" src={order.metodo === "yape" ? PAYMENT_INFO.qr.yape : PAYMENT_INFO.qr.plin} alt={`Código QR de ${order.metodo === "yape" ? "Yape" : "Plin"}`} width={240} height={240} />
            </>
          )}
          {order.metodo === "transferencia" && (
            <ul className="plain">
              {PAYMENT_INFO.transferencia.map((t) => (
                <li key={t.banco}>
                  <strong>{t.banco}</strong><br />
                  Cuenta: {t.cuenta}<br />
                  CCI: {t.cci}<br />
                  Titular: {PAYMENT_INFO.yapePlin.titular}
                </li>
              ))}
            </ul>
          )}
          <p className="muted">Luego envíanos la captura por WhatsApp. Reservamos tus prendas por 24 horas.</p>
        </div>
      )}

      <a className="btn block" href={waLink(resumen)} target="_blank" rel="noopener noreferrer">
        {pagado ? "Confirmar pedido por WhatsApp" : "Enviar comprobante por WhatsApp"}
      </a>

      <h2>Resumen</h2>
      <ul className="plain">
        {order.lines.map((l, i) => <li key={i}>{l.name} · Talla {l.size} · x{l.qty} — {money(l.price * l.qty)}</li>)}
      </ul>
      <div className="row"><span>Envío</span><span>{order.envio ? money(order.envio) : "Gratis"}</span></div>
      {!!order.comision && <div className="row"><span>Comisión pago con tarjeta (5%)</span><span>{money(order.comision)}</span></div>}
      <div className="row total"><span>Total</span><strong>{money(order.total)}</strong></div>
      <Link to="/tienda" className="btn ghost block">Seguir comprando</Link>
    </div>
  );
}
