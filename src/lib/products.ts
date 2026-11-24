// Catálogo de Maison Inti. PRECIOS Y TALLAS DE EJEMPLO: reemplázalos por los reales.
// Cuando el catálogo crezca (miles de prendas), estos datos pasarán a la base de datos
// y las fotos a Vercel Blob. La tienda ya pagina de a 24 y carga las fotos solo al verlas.

export type Category = "blusas" | "blazers" | "pantalones" | "faldas" | "vestidos" | "conjuntos" | "tejidos";
export type SizeStock = { size: string; stock: number };
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  compareAt?: number;
  color: string;
  sizes: SizeStock[];
  image: string; // foto principal grande
  thumb: string; // foto liviana para el catálogo
  images: string[]; // galería
  description: string;
  material: string;
  isNew?: boolean;
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "blusas", label: "Blusas" },
  { id: "blazers", label: "Blazers y chaquetas" },
  { id: "conjuntos", label: "Conjuntos" },
  { id: "pantalones", label: "Pantalones y jeans" },
  { id: "faldas", label: "Faldas" },
  { id: "vestidos", label: "Vestidos" },
  { id: "tejidos", label: "Tejidos" },
];

export const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];

const s = (xs: number, sm: number, m: number, l: number, xl: number): SizeStock[] =>
  [xs, sm, m, l, xl].map((stock, i) => ({ size: SIZE_ORDER[i], stock }));

type Seed = Omit<Product, "id" | "image" | "thumb" | "images"> & { extra?: string[] };

const seeds: Seed[] = [
  { slug: "conjunto-tweed", name: "Conjunto tweed botones dorados", category: "conjuntos", price: 100, color: "Negro y blanco", sizes: s(0, 3, 4, 3, 1), material: "Tweed mezcla", description: "Saquito corto cuello redondo con bolsillos de solapa y falda short a juego, con botones dorados. Precio por el conjunto.", isNew: true },
  { slug: "blusa-campesina-crema", name: "Blusa campesina botones", category: "blusas", price: 65, color: "Crema", sizes: s(0, 3, 4, 3, 1), material: "Viscosa texturizada", description: "Blusa de cuello redondo con hombros fruncidos en smock, mangas globo y botonadura delantera.", isNew: true },
  { slug: "blusa-estampado-ovalos", name: "Blusa satinada estampada", category: "blusas", price: 65, color: "Verde y azul", sizes: s(0, 3, 4, 3, 1), material: "Satén", description: "Blusa de escote en V con estampado artístico de óvalos, manga 3/4 y pretina ajustada.", isNew: true },
  { slug: "blusa-encaje-tul-crema", name: "Blusa encaje y tul", category: "blusas", price: 75, color: "Crema", sizes: s(0, 3, 4, 3, 1), material: "Encaje floral y tul", description: "Blusa de encaje con bordes festoneados, escote cuadrado y mangas largas de tul transparente.", isNew: true },
  { slug: "jean-flare-botones", name: "Jean flare tres botones", category: "pantalones", price: 95, color: "Azul oscuro", sizes: s(1, 3, 5, 3, 1), material: "Denim stretch", description: "Jean de tiro alto con pretina ancha de tres botones y bota acampanada. Estiliza la figura.", isNew: true },
  { slug: "vestido-camisero-correa", name: "Vestido camisero con correa", category: "vestidos", price: 89.9, color: "Crema", sizes: s(0, 3, 4, 3, 1), material: "Algodón texturizado", description: "Vestido camisero con bolsillos al pecho, mangas recogibles y correa tejida con hebilla dorada.", isNew: true },
  { slug: "blusa-floral-abstracta", name: "Blusa floral abstracta", category: "blusas", price: 65, color: "Azul y terracota", sizes: s(0, 3, 4, 3, 1), material: "Viscosa", description: "Blusa de escote en V con estampado floral artístico y mangas 3/4 con vuelo.", isNew: true },
  { slug: "blusa-encaje-v-blanca", name: "Blusa escote encaje", category: "blusas", price: 75, color: "Blanco", sizes: s(0, 3, 4, 3, 1), material: "Crepé con encaje", description: "Blusa de manga corta con escote en V y mangas de encaje festoneado. Fresca y delicada.", isNew: true },
  { slug: "blusa-fucsia-v", name: "Blusa texturizada cuello V", category: "blusas", price: 65, color: "Fucsia", sizes: s(0, 3, 4, 3, 1), material: "Viscosa texturizada", description: "Blusa de escote en V con mangas mariposa y tela con textura arrugada. Color que ilumina.", isNew: true },
  { slug: "blusa-lunares-encaje", name: "Blusa lunares con encaje", category: "blusas", price: 65, color: "Negro con lunares", sizes: s(0, 3, 4, 3, 1), material: "Crepé", description: "Blusa de lunares con alforzas al pecho, aplicaciones de encaje y manga 3/4.", isNew: true },
  { slug: "blusa-alforzas-rosa", name: "Blusa alforzas", category: "blusas", price: 65, color: "Rosa palo", sizes: s(0, 3, 4, 3, 1), material: "Lino mezcla", description: "Blusa con cuello mao, alforzas en el pecho, botonadura delantera y manga corta abullonada.", isNew: true },
  { slug: "blusa-lazo-amarilla", name: "Blusa lazo al cuello", category: "blusas", price: 65, color: "Amarillo", sizes: s(0, 3, 4, 3, 1), material: "Crepé", description: "Blusa holgada con escote fruncido, lazo delantero y mangas globo.", isNew: true },
  { slug: "short-jean-crudo", name: "Short jean tiro alto", category: "pantalones", price: 69.9, color: "Crudo", sizes: s(1, 3, 4, 3, 1), material: "Denim 100% algodón", description: "Short de jean tiro alto con cinco bolsillos y costuras en contraste.", isNew: true },
  { slug: "blusa-guipur-camel", name: "Blusa guipur camel", category: "blusas", price: 75, color: "Camel", sizes: s(0, 3, 4, 3, 1), material: "Encaje guipur con canesú liso", description: "Blusa de encaje guipur floral con cuello camisa, botones forrados y puños lisos. Elegante de día y de noche.", isNew: true },
  { slug: "blusa-guipur-negra", name: "Blusa guipur negra", category: "blusas", price: 75, color: "Negro", sizes: s(0, 3, 4, 3, 1), material: "Encaje guipur con canesú liso", description: "Blusa de encaje guipur floral con cuello camisa y puños lisos. Luce perfecta con un top debajo.", isNew: true },
  { slug: "blusa-guipur-blanca", name: "Blusa guipur blanca", category: "blusas", price: 75, color: "Blanco", sizes: s(0, 3, 4, 3, 1), material: "Encaje guipur con canesú liso", description: "Blusa de encaje guipur floral con cuello camisa y botones nacarados. Romántica y fresca.", isNew: true },
  { slug: "blusa-encaje-espiral-negra", name: "Blusa encaje espiral", category: "blusas", price: 75, color: "Negro", sizes: s(0, 2, 3, 2, 1), material: "Encaje macramé", description: "Blusa de encaje con diseño de espirales, cuello camisa y botones al tono." },
  { slug: "blusa-romantica-perlas", name: "Blusa romántica perlas", category: "blusas", price: 65, color: "Marfil", sizes: s(1, 3, 4, 3, 0), material: "Gasa texturizada", description: "Blusa de escote cuadrado con botones perla, vuelos verticales, espalda smock elástica y mangas abullonadas.", isNew: true },
  { slug: "blusa-campesina-floral", name: "Blusa campesina floral", category: "blusas", price: 65, color: "Lila floral", sizes: s(0, 3, 4, 2, 0), material: "Viscosa", description: "Blusa hombros descubiertos con mangas acampanadas y cintura smock. Ideal para el verano." },
  { slug: "top-crochet-menta", name: "Top crochet menta", category: "blusas", price: 75, color: "Verde menta", sizes: s(0, 2, 3, 2, 0), material: "Crochet de algodón", description: "Top corto de crochet con mangas abullonadas y forro interior. Fresco y femenino." },
  { slug: "camisa-rayas-azul", name: "Camisa rayas azul", category: "blusas", price: 65, color: "Azul y blanco", sizes: s(0, 3, 4, 3, 2), material: "Algodón texturizado", description: "Camisa holgada a rayas con escote en V y mangas recogibles. Básico de todos los días." },
  { slug: "chaleco-denim-lentejuelas", name: "Chaleco denim lentejuelas", category: "blazers", price: 119.9, color: "Denim claro", sizes: s(0, 2, 3, 2, 1), material: "Denim 100% algodón", description: "Chaleco de jean lavado claro con bolsillos bordados en lentejuelas. Polo blanco se vende por separado.", isNew: true },
  { slug: "blazer-verde-fruncido", name: "Blazer verde manga fruncida", category: "blazers", price: 85, color: "Verde", sizes: s(0, 2, 3, 2, 1), material: "Crepé stretch", description: "Blazer de un botón con bolsillos de solapa y mangas fruncidas regulables. Un toque de color." },
  { slug: "blazer-beige", name: "Blazer entallado beige", category: "blazers", price: 85, color: "Beige", sizes: s(1, 3, 4, 3, 1), material: "Crepé stretch", description: "Blazer entallado de un botón con solapa clásica. Indispensable en tu armario." },
  { slug: "chaqueta-cierres-dorados", name: "Chaqueta cierres dorados", category: "blazers", price: 85, color: "Negro", sizes: s(0, 2, 3, 2, 1), material: "Crepé", description: "Chaqueta corta sin cuello con cortes delanteros y bolsillos con cierre dorado." },
  { slug: "pantalon-sastre-correa", name: "Pantalón sastre con correa", category: "pantalones", price: 75, color: "Azul marino", sizes: s(1, 3, 4, 3, 1), material: "Crepé", description: "Pantalón de tiro alto y pierna recta con correa forrada al tono y bolsillos laterales." },
  { slug: "vestido-midi-tropical", name: "Vestido midi tropical", category: "vestidos", price: 139.9, color: "Negro y crudo", sizes: s(0, 2, 3, 2, 1), material: "Viscosa", description: "Vestido midi estampado de hojas con escote corazón cruzado, mangas con vuelo y abertura lateral.", isNew: true },
  { slug: "polo-tejido-rayas", name: "Polo tejido rayas", category: "tejidos", price: 69.9, color: "Crudo y camel", sizes: s(0, 3, 4, 3, 1), material: "Tejido de punto", description: "Polo de punto suave a rayas con cuello redondo y manga corta." },
  { slug: "vestido-poleron-lentejuelas", name: "Vestido polerón lentejuelas", category: "vestidos", price: 119.9, color: "Negro", sizes: s(0, 2, 3, 2, 0), material: "Algodón french terry", description: "Vestido tipo polerón de manga larga con letras bordadas en lentejuelas. Cómodo y con brillo.", isNew: true, extra: ["vestido-poleron-lentejuelas-2"] },
  { slug: "top-satin-tiras-brillo-marfil", name: "Top satinado tiras brillantes", category: "blusas", price: 65, color: "Marfil", sizes: s(0, 3, 4, 3, 1), material: "Satén", description: "Top de satén con escote recto y tiras finas con brillos. Perfecto para salir.", isNew: true },
  { slug: "top-satin-tiras-brillo-beige", name: "Top satinado tiras brillantes", category: "blusas", price: 65, color: "Beige", sizes: s(0, 3, 4, 3, 1), material: "Satén", description: "Top de satén con escote recto y tiras finas con brillos. Perfecto para salir." },
  { slug: "top-halter-lunares", name: "Top halter lunares", category: "blusas", price: 65, color: "Beige con lunares", sizes: s(0, 2, 3, 2, 0), material: "Viscosa", description: "Top halter anudado al cuello con espalda smock elástica y estampado de lunares.", extra: ["top-halter-lunares-2"] },
  { slug: "blusa-hombros-floral-negra", name: "Blusa hombros descubiertos floral", category: "blusas", price: 65, color: "Negro floral", sizes: s(0, 3, 4, 3, 1), material: "Viscosa texturizada", description: "Blusa con escote elástico, lazo al centro, mangas acampanadas y cintura smock." },
  { slug: "blusa-hombros-floral-azul", name: "Blusa hombros descubiertos floral", category: "blusas", price: 65, color: "Azul floral", sizes: s(0, 3, 4, 3, 1), material: "Viscosa texturizada", description: "Blusa con escote elástico, lazo al centro, mangas acampanadas y cintura smock." },
  { slug: "blusa-hombros-floral-rosa", name: "Blusa hombros descubiertos floral", category: "blusas", price: 65, color: "Rosa floral", sizes: s(0, 3, 4, 3, 1), material: "Viscosa texturizada", description: "Blusa con escote elástico, lazo al centro, mangas acampanadas y cintura smock." },
  { slug: "falda-jean-correa-oscura", name: "Falda jean con correa", category: "faldas", price: 79.9, color: "Azul oscuro", sizes: s(1, 3, 4, 3, 1), material: "Denim stretch", description: "Minifalda de jean con correa a juego y hebilla metálica, cinco bolsillos y basta desflecada.", isNew: true },
  { slug: "falda-jean-correa-clara", name: "Falda jean con correa", category: "faldas", price: 79.9, color: "Azul claro", sizes: s(1, 3, 4, 3, 1), material: "Denim stretch", description: "Minifalda de jean lavado claro con correa a juego y basta desflecada." },
  { slug: "jean-wide-leg-azul", name: "Jean wide leg tiro alto", category: "pantalones", price: 95, color: "Azul oscuro", sizes: s(1, 3, 5, 3, 1), material: "Denim stretch", description: "Jean de tiro alto y pierna ancha con efecto push-up atrás. Correa no incluida.", isNew: true, extra: ["jean-wide-leg-azul-2"] },
  { slug: "jean-wide-leg-negro", name: "Jean wide leg tiro alto", category: "pantalones", price: 95, color: "Negro", sizes: s(1, 3, 5, 3, 1), material: "Denim stretch", description: "Jean de tiro alto y pierna ancha. Correa no incluida.", extra: ["jean-wide-leg-negro-2"] },
  { slug: "pantalon-palazzo-estampado", name: "Pantalón palazzo estampado", category: "pantalones", price: 75, color: "Rosa y crudo", sizes: s(0, 3, 4, 3, 1), material: "Crepé fluido", description: "Pantalón palazzo de cintura elástica con bolsillos y estampado orgánico. Fresco y cómodo." },
  { slug: "chompa-calada-negra", name: "Chompa calada murciélago", category: "tejidos", price: 99.9, color: "Negro", sizes: s(0, 0, 4, 0, 0), material: "Tejido calado", description: "Chompa oversize de punto calado con manga murciélago. Talla única (M).", isNew: true },
];

export const PRODUCTS: Product[] = seeds.map(({ extra = [], ...p }, i) => ({
  ...p,
  id: `p${String(i + 1).padStart(4, "0")}`,
  image: `/productos/${p.slug}.webp`,
  thumb: `/productos/${p.slug}-sm.webp`,
  images: [p.slug, ...extra].map((x) => `/productos/${x}.webp`),
}));

function norm(t: string) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export type Filters = {
  q?: string;
  categoria?: string;
  talla?: string;
  min?: number;
  max?: number;
  orden?: string;
  pagina?: number;
  nuevo?: boolean;
};

export const PAGE_SIZE = 24;

export function queryProducts(f: Filters) {
  let list = PRODUCTS.slice();
  if (f.q) {
    const q = norm(f.q);
    list = list.filter((p) => norm(`${p.name} ${p.color} ${p.category} ${p.material}`).includes(q));
  }
  if (f.nuevo) list = list.filter((p) => p.isNew);
  if (f.categoria) list = list.filter((p) => p.category === f.categoria);
  if (f.talla) list = list.filter((p) => p.sizes.some((x) => x.size === f.talla && x.stock > 0));
  if (f.min != null && !Number.isNaN(f.min)) list = list.filter((p) => p.price >= f.min!);
  if (f.max != null && !Number.isNaN(f.max)) list = list.filter((p) => p.price <= f.max!);
  if (f.orden === "precio-asc") list.sort((a, b) => a.price - b.price);
  else if (f.orden === "precio-desc") list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, f.pagina || 1), pages);
  return { items: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total, page, pages };
}

export function totalStock(p: Product) {
  return p.sizes.reduce((a, b) => a + b.stock, 0);
}
