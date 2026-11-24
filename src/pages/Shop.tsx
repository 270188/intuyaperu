import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, queryProducts, SIZE_ORDER } from "../lib/products";

export default function Shop() {
  const [sp, setSp] = useSearchParams();
  const [filters, setFilters] = useState(false);
  const get = (k: string) => sp.get(k) ?? "";
  const num = (k: string) => (sp.get(k) ? Number(sp.get(k)) : undefined);

  const res = queryProducts({
    q: get("q") || undefined,
    categoria: get("categoria") || undefined,
    talla: get("talla") || undefined,
    min: num("min"),
    max: num("max"),
    orden: get("orden") || undefined,
    pagina: num("pagina"),
    nuevo: sp.get("nuevo") === "1",
  });

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(sp);
    if (v) next.set(k, v);
    else next.delete(k);
    if (k !== "pagina") next.delete("pagina");
    setSp(next);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [res.page]);

  const cat = CATEGORIES.find((c) => c.id === get("categoria"));
  const title = get("q") ? `Resultados para “${get("q")}”` : cat ? cat.label : sp.get("nuevo") === "1" ? "Novedades" : "Toda la colección";

  useEffect(() => {
    document.title = `${title} · INTUYA PERÚ`;
  }, [title]);

  return (
    <div className="shop">
      <div className="shop-head">
        <h1>{title}</h1>
        <span className="muted">{res.total} prendas</span>
      </div>
      <div className="chips" role="tablist">
        <button className={!cat ? "chip on" : "chip"} onClick={() => set("categoria", "")}>Todo</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={cat?.id === c.id ? "chip on" : "chip"} onClick={() => set("categoria", c.id)}>{c.label}</button>
        ))}
        <button className="chip filter-toggle" onClick={() => setFilters(!filters)} aria-expanded={filters}>Filtrar +</button>
      </div>
      {filters && (
        <div className="filters">
          <label>
            Talla
            <select value={get("talla")} onChange={(e) => set("talla", e.target.value)}>
              <option value="">Todas</option>
              {SIZE_ORDER.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>
            Precio
            <select
              value={`${get("min")}-${get("max")}`}
              onChange={(e) => {
                const [mi, ma] = e.target.value.split("-");
                const next = new URLSearchParams(sp);
                mi ? next.set("min", mi) : next.delete("min");
                ma ? next.set("max", ma) : next.delete("max");
                next.delete("pagina");
                setSp(next);
              }}
            >
              <option value="-">Todos</option>
              <option value="-100">Hasta S/ 100</option>
              <option value="100-200">S/ 100 a S/ 200</option>
              <option value="200-">Más de S/ 200</option>
            </select>
          </label>
          <label>
            Ordenar
            <select value={get("orden")} onChange={(e) => set("orden", e.target.value)}>
              <option value="">Novedades</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </label>
          {sp.toString() && <button className="link" onClick={() => setSp(new URLSearchParams())}>Limpiar filtros</button>}
        </div>
      )}
      {res.items.length === 0 ? (
        <div className="empty">
          <p>No encontramos prendas con esos filtros.</p>
          <Link to="/tienda" className="btn">Ver toda la colección</Link>
        </div>
      ) : (
        <div className="grid">
          {res.items.map((p, i) => <ProductCard key={p.id} p={p} eager={i < 4} />)}
        </div>
      )}
      {res.pages > 1 && (
        <nav className="pager" aria-label="Páginas">
          <button disabled={res.page <= 1} onClick={() => set("pagina", String(res.page - 1))}>Anterior</button>
          <span>{res.page} / {res.pages}</span>
          <button disabled={res.page >= res.pages} onClick={() => set("pagina", String(res.page + 1))}>Siguiente</button>
        </nav>
      )}
    </div>
  );
}
