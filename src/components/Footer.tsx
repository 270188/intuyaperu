import { Link } from "react-router-dom";
import { STORE, waLink } from "../lib/config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="logo small">MAISON INTI<span>PERÚ</span></div>
          <p className="muted">Moda femenina elegante y atemporal, pensada en Perú.</p>
        </div>
        <div>
          <h4>Ayuda</h4>
          <Link to="/legal/envios">Envíos</Link>
          <Link to="/legal/cambios">Cambios y devoluciones</Link>
          <Link to="/legal/pagos">Medios de pago</Link>
          <a href={waLink("Hola Maison Inti, tengo una consulta")} target="_blank" rel="noopener noreferrer">WhatsApp {STORE.whatsappDisplay}</a>
          <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
        </div>
        <div>
          <h4>Legal</h4>
          <Link to="/legal/terminos">Términos y condiciones</Link>
          <Link to="/legal/privacidad">Política de privacidad</Link>
          <Link to="/libro-de-reclamaciones" className="reclamos">
            <img src="/libro-reclamaciones.svg" alt="" width="40" height="28" />
            Libro de Reclamaciones
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {STORE.brand} · {STORE.razonSocial} · {STORE.ruc}</span>
        <span>Pagos seguros · Visa · Mastercard · Amex · Diners · Yape · Plin</span>
      </div>
    </footer>
  );
}
