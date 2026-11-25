import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../lib/cart";
import { cardFee, money, PROMO, promoDiscount } from "../lib/config";
import { newOrderId, saveOrder, validators, type Buyer, type Order, type PayMethod } from "../lib/order";
import { FREE_SHIPPING_FROM, SHIPPING_ZONES, shippingCost } from "../lib/shipping";

const METHODS: { id: PayMethod; label: string; desc: string }[] = [
  { id: "tarjeta", label: "Tarjeta de crédito o débito", desc: "Visa, Mastercard, American Express, Diners con Mercado Pago. Incluye 5% de comisión." },
  { id: "yape", label: "Yape", desc: "Yapea y envíanos la captura por WhatsApp." },
  { id: "plin", label: "Plin", desc: "Paga con Plin y envíanos la captura por WhatsApp." },
  { id: "transferencia", label: "Transferencia bancaria", desc: "BCP o Interbank. Envíanos la constancia por WhatsApp." },
];

const empty: Buyer = { nombre: "", email: "", telefono: "", documento: "", direccion: "", referencia: "", zona: "" };

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const nav = useNavigate();
  const [b, setB] = useState<Buyer>(empty);
  const [metodo, setMetodo] = useState<PayMethod>("tarjeta");
  const [acepto, setAcepto] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [fail, setFail] = useState("");
  const [cupon, setCupon] = useState("");
  const [cuponOk, setCuponOk] = useState(false);
  const [cuponMsg, setCuponMsg] = useState("");

  if (items.length === 0)
    return (
      <div className="page narrow center">
        <h1>Tu bolsa está vacía</h1>
        <Link to="/tienda" className="btn">Ver colección</Link>
      </div>
    );

  const descuento = cuponOk ? promoDiscount(subtotal) : 0;
  const neto = subtotal - descuento;
  const envio = b.zona ? shippingCost(b.zona, neto) ?? 0 : 0;
  const comision = metodo === "tarjeta" ? cardFee(neto + envio) : 0;
  const total = neto + envio + comision;

  function aplicarCupon() {
    if (cupon.trim().toUpperCase() === PROMO.code) {
      setCuponOk(true);
      setCuponMsg(`¡Listo! ${PROMO.label} aplicado.`);
    } else {
      setCuponOk(false);
      setCuponMsg("Ese código no es válido.");
    }
  }
  const upd = (k: keyof Buyer) => (e: { target: { value: string } }) => setB({ ...b, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFail("");
    const errs: Record<string, string> = {};
    (Object.keys(validators) as (keyof typeof validators)[]).forEach((k) => {
      const r = validators[k](b[k]);
      if (r !== true) errs[k] = r;
    });
    if (!acepto) errs.acepto = "Debes aceptar los términos y la política de privacidad";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const order: Order = {
      id: newOrderId(),
      fecha: new Date().toISOString(),
      buyer: { ...b, telefono: b.telefono.replace(/\D/g, "") },
      metodo,
      lines: items.map((i) => ({ name: i.product.name, size: i.size, qty: i.qty, price: i.product.price })),
      subtotal,
      envio,
      comision,
      descuento,
      cupon: cuponOk ? PROMO.code : undefined,
      total,
    };
    saveOrder(order);

    if (metodo === "tarjeta") {
      setSending(true);
      try {
        const r = await fetch("/api/mercadopago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            zone: b.zona,
            email: b.email.trim(),
            nombre: b.nombre.trim(),
            cupon: cuponOk ? PROMO.code : undefined,
            lines: items.map((i) => ({ id: i.id, size: i.size, qty: i.qty })),
          }),
        });
        const data = await r.json().catch(() => ({}));
        if (r.ok && typeof data.url === "string" && data.url.startsWith("https://")) {
          window.location.href = data.url;
          return;
        }
        if (r.status === 503) {
          // Sin integración automática: se paga con el link de Mercado Pago de la tienda.
          clear();
          nav("/gracias");
          return;
        }
        setFail(data.error || "No pudimos iniciar el pago con tarjeta. Intenta con Yape, Plin o transferencia.");
      } catch {
        setFail("Problema de conexión. Revisa tu internet e inténtalo otra vez.");
      }
      setSending(false);
      return;
    }

    clear();
    nav("/gracias");
  }

  const err = (k: string) => errors[k] && <span className="field-err">{errors[k]}</span>;

  return (
    <div className="checkout">
      <form className="checkout-form" onSubmit={submit} noValidate>
        <h1>Finalizar compra</h1>
        <h2>Tus datos</h2>
        <label>Nombre y apellidos<input value={b.nombre} onChange={upd("nombre")} autoComplete="name" maxLength={80} />{err("nombre")}</label>
        <div className="two">
          <label>Correo<input type="email" value={b.email} onChange={upd("email")} autoComplete="email" maxLength={120} />{err("email")}</label>
          <label>Celular<input type="tel" inputMode="numeric" value={b.telefono} onChange={upd("telefono")} autoComplete="tel" maxLength={12} />{err("telefono")}</label>
        </div>
        <label>DNI o CE<input value={b.documento} onChange={upd("documento")} maxLength={12} />{err("documento")}</label>

        <h2>Envío</h2>
        <label>Zona
          <select value={b.zona} onChange={upd("zona")}>
            <option value="">Elige tu zona</option>
            {SHIPPING_ZONES.map((z) => (
              <option key={z.id} value={z.id}>{z.label} · {z.cost ? money(z.cost) : "Gratis"} · {z.days}</option>
            ))}
          </select>
          {err("zona")}
        </label>
        <label>Dirección completa y distrito<input value={b.direccion} onChange={upd("direccion")} autoComplete="street-address" maxLength={160} />{err("direccion")}</label>
        <label>Referencia (opcional)<input value={b.referencia} onChange={upd("referencia")} maxLength={160} /></label>
        <p className="muted small">Envío gratis en Lima y Callao desde {money(FREE_SHIPPING_FROM)}.</p>

        <h2>Código de descuento</h2>
        <div className="coupon">
          <input value={cupon} onChange={(e) => { setCupon(e.target.value); setCuponOk(false); setCuponMsg(""); }} placeholder={`Ej. ${PROMO.code}`} aria-label="Código de descuento" maxLength={20} />
          <button type="button" className="btn ghost" onClick={aplicarCupon}>Aplicar</button>
        </div>
        {cuponMsg && <p className={cuponOk ? "ok-msg" : "field-err"}>{cuponMsg}</p>}
        <p className="muted small">Válido desde tu segunda compra. Verificamos tu compra anterior con tu DNI antes del envío.</p>

        <h2>Pago</h2>
        <div className="methods" role="radiogroup">
          {METHODS.map((m) => (
            <label key={m.id} className={metodo === m.id ? "method on" : "method"}>
              <input type="radio" name="metodo" checked={metodo === m.id} onChange={() => setMetodo(m.id)} />
              <span><strong>{m.label}</strong><small>{m.desc}</small></span>
            </label>
          ))}
        </div>

        <label className="check">
          <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} />
          <span>Acepto los <Link to="/legal/terminos" target="_blank">términos y condiciones</Link> y la <Link to="/legal/privacidad" target="_blank">política de privacidad</Link>.</span>
        </label>
        {err("acepto")}
        {fail && <p className="warn" role="alert">{fail}</p>}
        <button className="btn block" disabled={sending}>{sending ? "Conectando con Mercado Pago…" : metodo === "tarjeta" ? `Pagar ${money(total)}` : `Confirmar pedido · ${money(total)}`}</button>
        <p className="muted small center">🔒 Tus datos viajan cifrados. Nunca guardamos los datos de tu tarjeta.</p>
      </form>

      <aside className="summary">
        <h2>Resumen</h2>
        <ul className="lines compact">
          {items.map((i) => (
            <li key={i.id + i.size} className="line">
              <img src={i.product.thumb} alt="" width={56} height={75} loading="lazy" />
              <div className="line-info"><span>{i.product.name}</span><span className="muted">Talla {i.size} · x{i.qty}</span></div>
              <span>{money(i.qty * i.product.price)}</span>
            </li>
          ))}
        </ul>
        <div className="row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        {descuento > 0 && <div className="row ok-msg"><span>Descuento {PROMO.code} (10%)</span><span>−{money(descuento)}</span></div>}
        <div className="row"><span>Envío</span><span>{b.zona ? (envio ? money(envio) : "Gratis") : "—"}</span></div>
        {comision > 0 && <div className="row"><span>Comisión pago con tarjeta (5%)</span><span>{money(comision)}</span></div>}
        <div className="row total"><span>Total</span><strong>{money(total)}</strong></div>
      </aside>
    </div>
  );
}
