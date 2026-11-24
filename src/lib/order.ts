export type PayMethod = "tarjeta" | "yape" | "plin" | "transferencia";

export type Buyer = {
  nombre: string;
  email: string;
  telefono: string;
  documento: string;
  direccion: string;
  referencia: string;
  zona: string;
};

export type Order = {
  id: string;
  fecha: string;
  buyer: Buyer;
  metodo: PayMethod;
  lines: { name: string; size: string; qty: number; price: number }[];
  subtotal: number;
  envio: number;
  total: number;
};

export function newOrderId() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(0, 5);
  return `IP-${ymd}-${rand}`;
}

export const validators = {
  nombre: (v: string) => v.trim().length >= 3 || "Escribe tu nombre completo",
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Correo no válido",
  telefono: (v: string) => /^9\d{8}$/.test(v.replace(/\D/g, "")) || "Celular de 9 dígitos que empiece con 9",
  documento: (v: string) => /^(\d{8}|[A-Za-z0-9]{9,12})$/.test(v.trim()) || "DNI de 8 dígitos o CE válido",
  direccion: (v: string) => v.trim().length >= 6 || "Escribe tu dirección",
  zona: (v: string) => !!v || "Elige tu zona de envío",
};

export function saveOrder(o: Order) {
  try {
    sessionStorage.setItem("intuya_last_order", JSON.stringify(o));
  } catch {
    /* sin almacenamiento */
  }
}

export function loadOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem("intuya_last_order");
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}
