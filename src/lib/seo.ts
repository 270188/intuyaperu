import type { Product } from "./products";
import { STORE } from "./config";
import { totalStock } from "./products";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(path: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = STORE.domain + path;
}

export function productSeo(p: Product) {
  const full = p.name.toLowerCase().includes(p.color.toLowerCase().split(" ")[0]) ? p.name : `${p.name} ${p.color}`;
  const desc = `${p.name} color ${p.color} a S/ ${p.price.toFixed(2)}. ${p.description} Envíos a todo el Perú.`;
  document.title = `${full} | MAISON INTI`;
  setMeta("description", desc);
  setMeta("og:title", `${p.name} · MAISON INTI`, "property");
  setMeta("og:description", desc, "property");
  setMeta("og:image", STORE.domain + p.image, "property");
  setCanonical(`/producto/${p.slug}`);

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: full,
    image: [STORE.domain + p.image],
    description: p.description,
    sku: p.id,
    color: p.color,
    material: p.material,
    brand: { "@type": "Brand", name: "Maison Inti" },
    offers: {
      "@type": "Offer",
      url: `${STORE.domain}/producto/${p.slug}`,
      priceCurrency: "PEN",
      price: p.price.toFixed(2),
      availability: totalStock(p) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Maison Inti" },
    },
  };
  let s = document.getElementById("ld-product");
  if (!s) {
    s = document.createElement("script");
    s.id = "ld-product";
    s.setAttribute("type", "application/ld+json");
    document.head.appendChild(s);
  }
  s.textContent = JSON.stringify(data);
}

export function clearProductSeo() {
  document.getElementById("ld-product")?.remove();
}
