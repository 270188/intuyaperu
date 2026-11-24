import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProductById, type Product } from "./products";

export type CartLine = { id: string; size: string; qty: number };
export type CartItem = CartLine & { product: Product; max: number };

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (id: string, size: string, qty?: number) => void;
  setQty: (id: string, size: string, qty: number) => void;
  remove: (id: string, size: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "intuya_cart_v1";

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.filter((l) => typeof l?.id === "string" && typeof l?.size === "string" && Number.isInteger(l?.qty)) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [lines]);

  const items = useMemo<CartItem[]>(
    () =>
      lines.flatMap((l) => {
        const product = getProductById(l.id);
        const max = product?.sizes.find((s) => s.size === l.size)?.stock ?? 0;
        if (!product || max <= 0) return [];
        return [{ ...l, qty: Math.min(l.qty, max), product, max }];
      }),
    [lines],
  );

  const value: Ctx = {
    items,
    count: items.reduce((a, b) => a + b.qty, 0),
    subtotal: items.reduce((a, b) => a + b.qty * b.product.price, 0),
    add(id, size, qty = 1) {
      setLines((prev) => {
        const found = prev.find((l) => l.id === id && l.size === size);
        if (found) return prev.map((l) => (l === found ? { ...l, qty: l.qty + qty } : l));
        return [...prev, { id, size, qty }];
      });
      setOpen(true);
    },
    setQty(id, size, qty) {
      setLines((prev) => prev.map((l) => (l.id === id && l.size === size ? { ...l, qty: Math.max(1, qty) } : l)));
    },
    remove(id, size) {
      setLines((prev) => prev.filter((l) => !(l.id === id && l.size === size)));
    },
    clear() {
      setLines([]);
    },
    open,
    setOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fuera de CartProvider");
  return ctx;
}
