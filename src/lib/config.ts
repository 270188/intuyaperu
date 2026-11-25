export const STORE = {
  name: "maisoninti.com.pe",
  brand: "MAISON INTI",
  domain: "https://maisoninti.com.pe",
  whatsapp: "51990073634",
  whatsappDisplay: "990 073 634",
  email: "ventas@maisoninti.com.pe",
  ruc: "RUC 10448163917",
  razonSocial: "Angela Valeria Ruiz Leon",
  direccion: "Lima, Perú",
  currency: "PEN",
};

export const PAYMENT_INFO = {
  yapePlin: { numero: "990 073 634", titular: "Angela Valeria Ruiz Leon" },
  qr: { yape: "/pagos/yape-qr.png", plin: "/pagos/plin-qr.png" },
  mercadoPagoLink: "https://link.mercadopago.com.pe/maisoninti",
  transferencia: [
    { banco: "Interbank · Cuenta Simple Soles", cuenta: "284 3196415446", cci: "00328401319641544675" },
  ],
};

export const CARD_FEE_RATE = 0.05; // comisión por pago con tarjeta

export function cardFee(amount: number) {
  return Math.round(amount * CARD_FEE_RATE * 100) / 100;
}

export function waLink(text: string) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function money(n: number) {
  return `S/ ${n.toFixed(2)}`;
}
