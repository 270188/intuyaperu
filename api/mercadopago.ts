import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProductById } from "../src/lib/products.js";
import { shippingCost, SHIPPING_ZONES } from "../src/lib/shipping.js";

// Crea una preferencia de Checkout Pro. Los precios SIEMPRE se calculan aquí,
// en el servidor, desde el catálogo: nunca se confía en lo que envía el navegador.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return res.status(503).json({ error: "El pago con tarjeta se activará muy pronto. Por ahora elige Yape, Plin o transferencia." });
  }

  const body = (typeof req.body === "string" ? safeJson(req.body) : req.body) ?? {};
  const { orderId, zone, email, nombre, lines } = body as Record<string, unknown>;

  if (typeof orderId !== "string" || !/^IP-\d{6}-[A-Z0-9]{1,6}$/.test(orderId)) return bad(res, "Pedido inválido");
  if (typeof zone !== "string" || !SHIPPING_ZONES.some((z) => z.id === zone)) return bad(res, "Zona inválida");
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) return bad(res, "Correo inválido");
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 50) return bad(res, "Carrito inválido");

  const items: { id: string; title: string; quantity: number; unit_price: number; currency_id: string }[] = [];
  let subtotal = 0;
  for (const l of lines) {
    const p = typeof l?.id === "string" ? getProductById(l.id) : undefined;
    const stock = p?.sizes.find((s) => s.size === l?.size)?.stock ?? 0;
    const qty = Number(l?.qty);
    if (!p || !Number.isInteger(qty) || qty < 1 || qty > stock) return bad(res, "Una prenda ya no tiene stock suficiente. Actualiza tu bolsa.");
    items.push({ id: `${p.id}-${l.size}`, title: `${p.name} · Talla ${l.size}`, quantity: qty, unit_price: p.price, currency_id: "PEN" });
    subtotal += qty * p.price;
  }
  const envio = shippingCost(zone, subtotal) ?? 0;
  if (envio > 0) items.push({ id: "envio", title: "Envío", quantity: 1, unit_price: envio, currency_id: "PEN" });
  const comision = Math.round((subtotal + envio) * 0.05 * 100) / 100;
  items.push({ id: "comision", title: "Comisión pago con tarjeta (5%)", quantity: 1, unit_price: comision, currency_id: "PEN" });

  const site = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://maisoninti.com.pe");

  const pref = {
    items,
    payer: { email, name: typeof nombre === "string" ? nombre.slice(0, 80) : undefined },
    external_reference: orderId,
    statement_descriptor: "MAISONINTI",
    back_urls: {
      success: `${site}/gracias?mp=success`,
      failure: `${site}/gracias?mp=failure`,
      pending: `${site}/gracias?mp=pending`,
    },
    auto_return: "approved",
    payment_methods: { installments: 12 },
  };

  try {
    const r = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "X-Idempotency-Key": orderId },
      body: JSON.stringify(pref),
    });
    const data = await r.json();
    if (!r.ok || !data.init_point) {
      console.error("Mercado Pago error", r.status, data?.message);
      return res.status(502).json({ error: "Mercado Pago no respondió. Intenta otra vez en un momento." });
    }
    return res.status(200).json({ url: data.init_point });
  } catch (e) {
    console.error("Mercado Pago fetch failed", e);
    return res.status(502).json({ error: "No pudimos conectar con Mercado Pago." });
  }
}

function bad(res: VercelResponse, error: string) {
  return res.status(400).json({ error });
}

function safeJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
