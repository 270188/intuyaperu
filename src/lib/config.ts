export const STORE = {
  name: "intuyaperu.com",
  brand: "MAISON INTI",
  domain: "https://intuyaperu.com",
  whatsapp: "51990073634",
  whatsappDisplay: "990 073 634",
  email: "hola@intuyaperu.com",
  // Completa estos datos con la información real de tu negocio:
  ruc: "RUC por completar",
  razonSocial: "Razón social por completar",
  direccion: "Lima, Perú",
  currency: "PEN",
};

export const PAYMENT_INFO = {
  yapePlin: { numero: "990 073 634", titular: "Angela Valeria Ruiz Leon" },
  qr: { yape: "/pagos/yape-qr.png", plin: "/pagos/plin-qr.png" },
  transferencia: [
    { banco: "Interbank · Cuenta Simple Soles", cuenta: "284 3196415446", cci: "00328401319641544675" },
  ],
};

export function waLink(text: string) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function money(n: number) {
  return `S/ ${n.toFixed(2)}`;
}
