import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page narrow center">
      <h1>Página no encontrada</h1>
      <p className="muted">Lo que buscas ya no está aquí, pero tenemos mucho más.</p>
      <Link to="/tienda" className="btn">Ir a la tienda</Link>
    </div>
  );
}
