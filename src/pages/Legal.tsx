import { useEffect, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { money, PAYMENT_INFO, STORE } from "../lib/config";
import { FREE_SHIPPING_FROM, SHIPPING_ZONES } from "../lib/shipping";
import NotFound from "./NotFound";

const PAGES: Record<string, { title: string; body: () => ReactNode }> = {
  envios: {
    title: "Envíos",
    body: () => (
      <>
        <p>Enviamos a todo el Perú. El costo se calcula en el checkout según tu zona.</p>
        <ul>{SHIPPING_ZONES.map((z) => <li key={z.id}><strong>{z.label}</strong>: {z.cost ? money(z.cost) : "Gratis"} · {z.days}</li>)}</ul>
        <p>Envío gratis en Lima y Callao por compras desde {money(FREE_SHIPPING_FROM)}. Los plazos cuentan desde la confirmación del pago.</p>
      </>
    ),
  },
  cambios: {
    title: "Cambios y devoluciones",
    body: () => (
      <>
        <p>Puedes solicitar el cambio de talla o modelo dentro de los 7 días calendario siguientes a la entrega.</p>
        <ul>
          <li>La prenda debe estar sin uso, sin lavar y con sus etiquetas.</li>
          <li>Escríbenos por WhatsApp con tu número de pedido para coordinar.</li>
          <li>Si la prenda llegó con falla, el cambio o la devolución del dinero corre por nuestra cuenta.</li>
          <li>Por higiene, no se aceptan cambios de ropa interior ni accesorios de uso personal.</li>
        </ul>
      </>
    ),
  },
  pagos: {
    title: "Medios de pago",
    body: () => (
      <>
        <p><strong>Tarjetas de crédito y débito</strong> (Visa, Mastercard, American Express, Diners) a través de Mercado Pago. Tus datos de tarjeta los procesa Mercado Pago; nosotros nunca los vemos ni los guardamos.</p>
        <p><a className="btn" href={PAYMENT_INFO.mercadoPagoLink} target="_blank" rel="noopener noreferrer">Pagar con Mercado Pago</a></p>
        <p><strong>Yape y Plin</strong> al {PAYMENT_INFO.yapePlin.numero}, a nombre de {PAYMENT_INFO.yapePlin.titular}. Envíanos la captura por WhatsApp.</p>
        <div className="qrs">
          <figure><img className="qr" src={PAYMENT_INFO.qr.yape} alt="Código QR de Yape" width={200} height={200} loading="lazy" /><figcaption>Yape</figcaption></figure>
          <figure><img className="qr" src={PAYMENT_INFO.qr.plin} alt="Código QR de Plin" width={200} height={200} loading="lazy" /><figcaption>Plin</figcaption></figure>
        </div>
        {PAYMENT_INFO.transferencia.map((t) => (
          <p key={t.banco}><strong>Transferencia: {t.banco}</strong><br />Cuenta: {t.cuenta}<br />CCI: {t.cci}<br />Titular: {PAYMENT_INFO.yapePlin.titular}<br />Envíanos la constancia por WhatsApp.</p>
        ))}
      </>
    ),
  },
  terminos: {
    title: "Términos y condiciones",
    body: () => (
      <>
        <p>Al comprar en {STORE.name} aceptas estas condiciones. Los precios están en soles e incluyen IGV. Las imágenes son referenciales; el color puede variar ligeramente según tu pantalla.</p>
        <p>Los pedidos pagados con Yape, Plin o transferencia se reservan por 24 horas hasta recibir el comprobante. Pasado ese plazo, el pedido se anula.</p>
        <p>El stock se confirma al momento del pago. Si una prenda se agota, te ofreceremos un cambio o la devolución total del dinero.</p>
        <p>Para reclamos puedes usar nuestro <Link to="/libro-de-reclamaciones">Libro de Reclamaciones</Link>.</p>
      </>
    ),
  },
  privacidad: {
    title: "Política de privacidad",
    body: () => (
      <>
        <p>En cumplimiento de la Ley N° 29733, Ley de Protección de Datos Personales, te informamos que los datos que nos das (nombre, documento, correo, celular y dirección) se usan solo para procesar tu pedido, enviarlo y atenderte.</p>
        <p>No vendemos ni compartimos tus datos, salvo con el operador de pagos (Mercado Pago) y la empresa de envíos, solo en lo necesario para completar tu compra.</p>
        <p>Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición escribiendo a {STORE.email}.</p>
      </>
    ),
  },
};

export default function Legal() {
  const { page = "" } = useParams();
  const p = PAGES[page];
  useEffect(() => {
    if (p) document.title = `${p.title} · MAISON INTI`;
  }, [p]);
  if (!p) return <NotFound />;
  return (
    <div className="page narrow prose">
      <h1>{p.title}</h1>
      <p.body />
    </div>
  );
}
