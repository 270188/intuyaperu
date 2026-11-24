export type ShippingZone = { id: string; label: string; cost: number; days: string };

export const SHIPPING_ZONES: ShippingZone[] = [
  { id: "lima-moderna", label: "Lima Moderna (Miraflores, San Isidro, Surco, San Borja, Barranco, etc.)", cost: 10, days: "24 a 48 h" },
  { id: "lima-centro", label: "Lima Centro (Cercado, Breña, Jesús María, Lince, La Victoria, etc.)", cost: 12, days: "24 a 48 h" },
  { id: "lima-periferia", label: "Lima Norte, Este y Sur", cost: 15, days: "48 a 72 h" },
  { id: "callao", label: "Callao", cost: 15, days: "48 a 72 h" },
  { id: "provincias", label: "Provincias (envío por agencia)", cost: 20, days: "3 a 7 días" },
  { id: "recojo", label: "Recojo coordinado (gratis)", cost: 0, days: "Coordinar por WhatsApp" },
];

export const FREE_SHIPPING_FROM = 250;

export function shippingCost(zoneId: string, subtotal: number) {
  const zone = SHIPPING_ZONES.find((z) => z.id === zoneId);
  if (!zone) return null;
  if (zone.id !== "provincias" && subtotal >= FREE_SHIPPING_FROM) return 0;
  return zone.cost;
}
