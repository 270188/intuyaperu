// Genera public/sitemap.xml y public/robots.txt a partir del catálogo antes de cada build.
import fs from "node:fs";

const SITE = "https://maisoninti.com.pe";
const src = fs.readFileSync("src/lib/products.ts", "utf8");
const slugs = [...src.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
const cats = [...src.matchAll(/\{ id: "([a-z]+)", label: "/g)].map((m) => m[1]);
const today = new Date().toISOString().slice(0, 10);

const urls = [
  ["/", "1.0"],
  ["/tienda", "0.9"],
  ...cats.map((c) => [`/tienda?categoria=${c}`, "0.8"]),
  ...slugs.map((s) => [`/producto/${s}`, "0.7"]),
  ...["envios", "cambios", "pagos", "terminos", "privacidad"].map((p) => [`/legal/${p}`, "0.3"]),
  ["/libro-de-reclamaciones", "0.3"],
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(([u, p]) => `  <url><loc>${SITE}${u.replace(/&/g, "&amp;")}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`)
    .join("\n") +
  `\n</urlset>\n`;

fs.writeFileSync("public/sitemap.xml", xml);
fs.writeFileSync("public/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`sitemap: ${urls.length} páginas (${slugs.length} prendas)`);
