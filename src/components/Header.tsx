import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../lib/products";
import { useCart } from "../lib/cart";
import { FREE_SHIPPING_FROM } from "../lib/shipping";

export default function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  function submit(e: FormEvent) {
    e.preventDefault();
    setSearch(false);
    setMenu(false);
    nav(`/tienda?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <>
      <div className="topbar">Apertura: 10% de descuento en tu segunda compra · Envío gratis en Lima desde S/ {FREE_SHIPPING_FROM}</div>
      <header className="header">
        <button className="icon-btn menu-btn" aria-label="Abrir menú" aria-expanded={menu} onClick={() => setMenu(!menu)}>
          <span className={menu ? "burger open" : "burger"} />
        </button>
        <nav className="nav-left" aria-label="Categorías">
          <NavLink to="/tienda" end>Todo</NavLink>
          {CATEGORIES.slice(0, 3).map((c) => (
            <Link key={c.id} to={`/tienda?categoria=${c.id}`}>{c.label}</Link>
          ))}
        </nav>
        <Link to="/" className="logo" aria-label="Maison Inti, inicio">
          MAISON INTI<span>PERÚ</span>
        </Link>
        <div className="nav-right">
          <button className="text-btn" onClick={() => setSearch(!search)} aria-expanded={search}>Buscar</button>
          <button className="text-btn" onClick={() => setOpen(true)} aria-label={`Carrito, ${count} prendas`}>
            Bolsa <span className="count">({count})</span>
          </button>
        </div>
      </header>
      {search && (
        <form className="searchbar" onSubmit={submit} role="search">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="¿Qué estás buscando?" aria-label="Buscar prendas" maxLength={80} />
          <button type="submit">Buscar</button>
        </form>
      )}
      <div className={menu ? "mobile-menu open" : "mobile-menu"} onClick={() => setMenu(false)}>
        <nav onClick={(e) => e.stopPropagation()} aria-label="Menú">
          <Link to="/tienda" onClick={() => setMenu(false)}>Ver todo</Link>
          <Link to="/tienda?nuevo=1" onClick={() => setMenu(false)}>Novedades</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/tienda?categoria=${c.id}`} onClick={() => setMenu(false)}>{c.label}</Link>
          ))}
          <form onSubmit={submit} className="menu-search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" aria-label="Buscar" maxLength={80} />
          </form>
        </nav>
      </div>
    </>
  );
}
