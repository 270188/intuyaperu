export const STORE = {
  name: "intuyaperu.com",
  brand: "INTUYA PERÚ",
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
  // Reemplaza con tus datos reales antes de vender:
  yapePlin: { numero: "990 073 634", titular: "Titular por completar" },
  transferencia: [
    { banco: "BCP", cuenta: "Cuenta por completar", cci: "CCI por completar" },
    { banco: "Interbank", cuenta: "Cuenta por completar", cci: "CCI por completar" },
  ],
};

export function waLink(text: string) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function money(n: number) {
  return `S/ ${n.toFixed(2)}`;
}
