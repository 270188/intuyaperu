import { useEffect, useState, type FormEvent } from "react";
import { STORE, waLink } from "../lib/config";
import { validators } from "../lib/order";

type R = {
  nombre: string; documento: string; email: string; telefono: string; direccion: string; menor: string;
  tipoBien: string; monto: string; descripcionBien: string; tipo: string; detalle: string; pedido: string;
};

const empty: R = { nombre: "", documento: "", email: "", telefono: "", direccion: "", menor: "", tipoBien: "producto", monto: "", descripcionBien: "", tipo: "reclamo", detalle: "", pedido: "" };

export default function Reclamaciones() {
  const [r, setR] = useState<R>(empty);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [codigo, setCodigo] = useState("");
  const upd = (k: keyof R) => (e: { target: { value: string } }) => setR({ ...r, [k]: e.target.value });

  useEffect(() => {
    document.title = "Libro de Reclamaciones · MAISON INTI";
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const x: Record<string, string> = {};
    for (const k of ["nombre", "email", "telefono", "documento", "direccion"] as const) {
      const v = validators[k](r[k]);
      if (v !== true) x[k] = v;
    }
    if (r.descripcionBien.trim().length < 3) x.descripcionBien = "Describe el producto o servicio";
    if (r.detalle.trim().length < 10) x.detalle = "Cuéntanos el detalle (mínimo 10 caracteres)";
    setErrs(x);
    if (Object.keys(x).length) return;
    const n = `LR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    setCodigo(n);
  }

  const texto = codigo
    ? [
        `*LIBRO DE RECLAMACIONES · ${STORE.brand}*`,
        `Hoja N° ${codigo} · Fecha: ${new Date().toLocaleString("es-PE")}`,
        `Tipo: ${r.tipo.toUpperCase()}`,
        `Consumidor: ${r.nombre} · DNI/CE ${r.documento}`,
        `Correo: ${r.email} · Cel: ${r.telefono}`,
        `Domicilio: ${r.direccion}`,
        r.menor ? `Padre/madre o apoderado: ${r.menor}` : "",
        `Bien: ${r.tipoBien} · ${r.descripcionBien}${r.monto ? ` · Monto S/ ${r.monto}` : ""}`,
        r.pedido ? `Pedido: ${r.pedido}` : "",
        `Detalle: ${r.detalle}`,
      ].filter(Boolean).join("\n")
    : "";

  if (codigo)
    return (
      <div className="page narrow">
        <h1>Hoja de reclamación registrada</h1>
        <p>Tu código es <strong>{codigo}</strong>. Para completar el registro, envíanos la hoja por WhatsApp o correo. Te responderemos en un plazo máximo de 15 días hábiles, según el Código de Protección y Defensa del Consumidor.</p>
        <pre className="receipt">{texto}</pre>
        <a className="btn block" href={waLink(texto)} target="_blank" rel="noopener noreferrer">Enviar por WhatsApp</a>
        <a className="btn ghost block" href={`mailto:${STORE.email}?subject=${encodeURIComponent(`Libro de Reclamaciones ${codigo}`)}&body=${encodeURIComponent(texto)}`}>Enviar por correo</a>
        <button className="link" onClick={() => window.print()}>Imprimir o guardar en PDF</button>
      </div>
    );

  const e = (k: string) => errs[k] && <span className="field-err">{errs[k]}</span>;

  return (
    <div className="page narrow">
      <h1>Libro de Reclamaciones</h1>
      <p className="muted small">{STORE.razonSocial} · {STORE.ruc} · {STORE.direccion}</p>
      <form onSubmit={submit} className="form" noValidate>
        <h2>1. Identificación del consumidor</h2>
        <label>Nombre completo<input value={r.nombre} onChange={upd("nombre")} maxLength={80} />{e("nombre")}</label>
        <div className="two">
          <label>DNI o CE<input value={r.documento} onChange={upd("documento")} maxLength={12} />{e("documento")}</label>
          <label>Celular<input type="tel" value={r.telefono} onChange={upd("telefono")} maxLength={12} />{e("telefono")}</label>
        </div>
        <label>Correo<input type="email" value={r.email} onChange={upd("email")} maxLength={120} />{e("email")}</label>
        <label>Domicilio<input value={r.direccion} onChange={upd("direccion")} maxLength={160} />{e("direccion")}</label>
        <label>Si eres menor de edad, nombre del padre, madre o apoderado<input value={r.menor} onChange={upd("menor")} maxLength={80} /></label>

        <h2>2. Bien contratado</h2>
        <div className="two">
          <label>Tipo<select value={r.tipoBien} onChange={upd("tipoBien")}><option value="producto">Producto</option><option value="servicio">Servicio</option></select></label>
          <label>Monto reclamado (S/)<input inputMode="decimal" value={r.monto} onChange={upd("monto")} maxLength={10} /></label>
        </div>
        <label>Descripción<input value={r.descripcionBien} onChange={upd("descripcionBien")} maxLength={160} />{e("descripcionBien")}</label>
        <label>N° de pedido (opcional)<input value={r.pedido} onChange={upd("pedido")} maxLength={30} /></label>

        <h2>3. Detalle</h2>
        <div className="methods">
          <label className={r.tipo === "reclamo" ? "method on" : "method"}><input type="radio" checked={r.tipo === "reclamo"} onChange={() => setR({ ...r, tipo: "reclamo" })} /><span><strong>Reclamo</strong><small>Disconformidad con los productos o servicios.</small></span></label>
          <label className={r.tipo === "queja" ? "method on" : "method"}><input type="radio" checked={r.tipo === "queja"} onChange={() => setR({ ...r, tipo: "queja" })} /><span><strong>Queja</strong><small>Malestar con la atención al público.</small></span></label>
        </div>
        <label>Detalle y pedido del consumidor<textarea rows={5} value={r.detalle} onChange={upd("detalle")} maxLength={2000} />{e("detalle")}</label>
        <button className="btn block">Registrar hoja</button>
        <p className="muted small">La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</p>
      </form>
    </div>
  );
}
