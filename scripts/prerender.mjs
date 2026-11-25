// Después del build: crea una página HTML lista para Google por cada prenda, categoría y página legal.
// Cada una trae su propio título, descripción, canonical, Open Graph, datos estructurados
// y contenido visible (que React reemplaza al cargar).
import fs from "node:fs";
import path from "node:path";

const SITE = "https://maisoninti.com.pe";
const BRAND = "MAISON INTI";
const tpl = fs.readFileSync("dist/index.html", "utf8");
const src = fs.readFileSync("src/lib/products.ts", "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const get = (row, key) => (row.match(new RegExp(`${key}: "([^"]*)"`)) || [])[1] || "";
const num = (row, key) => Number((row.match(new RegExp(`${key}: ([\\d.]+)`)) || [])[1] || 0);

const cats = Object.fromEntries([...src.matchAll(/\{ id: "([a-z]+)", label: "([^"]+)" \}/g)].map((m) => [m[1], m[2]]));
const products = src
  .split("\n")
  .filter((l) => l.trim().startsWith('{ slug: "'))
  .map((r) => ({
    slug: get(r, "slug"), name: get(r, "name"), category: get(r, "category"), price: num(r, "price"),
    color: get(r, "color"), material: get(r, "material"), description: get(r, "description"),
    inStock: !/sizes: s\(0, 0, 0, 0, 0\)/.test(r),
  }));

function page({ urlPath, title, description, image, jsonld = [], body }) {
  let html = tpl
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE}${urlPath}" />`);
  if (image) html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${SITE}${image}" />`);
  const ld = jsonld.map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`).join("");
  html = html.replace("</head>", `    <meta property="og:url" content="${SITE}${urlPath}" />\n    ${ld}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const out = path.join("dist", urlPath, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

const crumbs = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + url })),
});

// Prendas
const full = (p) => (p.name.toLowerCase().includes(p.color.toLowerCase().split(" ")[0]) ? p.name : `${p.name} ${p.color}`);
for (const p of products) {
  const cat = cats[p.category] || "Tienda";
  const img = `/productos/${p.slug}.webp`;
  const desc = `${p.name} color ${p.color} a S/ ${p.price.toFixed(2)}. ${p.description} Envíos a todo el Perú. Paga con tarjeta, Yape o Plin.`;
  page({
    urlPath: `/producto/${p.slug}`,
    title: `${full(p)} | ${BRAND}`,
    description: desc.slice(0, 300),
    image: img,
    jsonld: [
      {
        "@context": "https://schema.org", "@type": "Product", name: full(p), image: [SITE + img],
        description: p.description, sku: p.slug, color: p.color, material: p.material, category: cat,
        brand: { "@type": "Brand", name: "Maison Inti" },
        offers: {
          "@type": "Offer", url: `${SITE}/producto/${p.slug}`, priceCurrency: "PEN", price: p.price.toFixed(2),
          availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: "Maison Inti" },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "PE" },
            shippingRate: { "@type": "MonetaryAmount", value: "10.00", currency: "PEN" },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy", applicableCountry: "PE",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: 7,
          },
        },
      },
      crumbs([["Inicio", "/"], ["Tienda", "/tienda"], [cat, `/tienda?categoria=${p.category}`], [p.name, `/producto/${p.slug}`]]),
    ],
    body: `<main style="padding:24px;font-family:sans-serif"><nav><a href="/">Inicio</a> / <a href="/tienda">Tienda</a> / <a href="/tienda?categoria=${p.category}">${esc(cat)}</a></nav><h1>${esc(full(p))}</h1><img src="${img}" alt="${esc(`${p.name} color ${p.color}`)}" width="450" height="600"><p>S/ ${p.price.toFixed(2)}</p><p>${esc(p.description)}</p><p>Material: ${esc(p.material)}</p></main>`,
  });
}

// Tienda completa
const list = (ps) => `<ul>${ps.map((p) => `<li><a href="/producto/${p.slug}">${esc(p.name)} ${esc(p.color)} – S/ ${p.price.toFixed(2)}</a></li>`).join("")}</ul>`;
page({
  urlPath: "/tienda",
  title: `Toda la colección: ropa para mujer en Lima | ${BRAND}`,
  description: `Descubre ${products.length} prendas para mujer: blusas, blazers, conjuntos tweed, jeans, pantalones, vestidos y chompas. Envíos a todo el Perú.`,
  jsonld: [crumbs([["Inicio", "/"], ["Tienda", "/tienda"]])],
  body: `<main style="padding:24px;font-family:sans-serif"><h1>Toda la colección</h1>${list(products)}</main>`,
});

// Inicio: contenido visible para buscadores
let home = tpl.replace('<div id="root"></div>', `<div id="root"><main style="padding:24px;font-family:sans-serif"><h1>Maison Inti · Ropa para mujer en Lima, Perú</h1><p>Blusas, blazers, conjuntos tweed, jeans, pantalones, vestidos y chompas. Envíos a todo el Perú. Paga con tarjeta, Yape, Plin o transferencia.</p><nav>${Object.entries(cats).map(([id, l]) => `<a href="/tienda?categoria=${id}">${esc(l)}</a>`).join(" · ")}</nav>${list(products.slice(0, 24))}</main></div>`);
fs.writeFileSync("dist/index.html", home);

// Páginas legales
const legal = { envios: "Envíos", cambios: "Cambios y devoluciones", pagos: "Medios de pago", terminos: "Términos y condiciones", privacidad: "Política de privacidad" };
for (const [k, t] of Object.entries(legal)) {
  page({ urlPath: `/legal/${k}`, title: `${t} | ${BRAND}`, description: `${t} de Maison Inti, tienda de ropa para mujer en Lima, Perú.`, body: `<main style="padding:24px;font-family:sans-serif"><h1>${t}</h1></main>` });
}
page({ urlPath: "/libro-de-reclamaciones", title: `Libro de Reclamaciones | ${BRAND}`, description: "Libro de Reclamaciones virtual de Maison Inti.", body: `<main style="padding:24px;font-family:sans-serif"><h1>Libro de Reclamaciones</h1></main>` });

console.log(`prerender: ${products.length} prendas + tienda + legales`);
