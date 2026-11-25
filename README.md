# MAISON INTI · maisoninti.com.pe

Tienda virtual de moda femenina hecha con **Vite + React + TypeScript**, lista para desplegar en Vercel.

## Qué incluye
- Catálogo con categorías, buscador, filtros (talla, precio), orden y paginación de 24 en 24 (preparado para miles de prendas).
- Ficha de producto con galería, tallas con stock, "últimas unidades" y consulta por WhatsApp.
- Bolsa de compras guardada en el navegador, envío gratis desde S/ 250 en Lima.
- Checkout con validación (DNI/CE, celular peruano, correo) y costos de envío por zona.
- Pagos: tarjeta (Visa, Mastercard, Amex, Diners) con **Mercado Pago Checkout Pro**; Yape, Plin y transferencia con envío de comprobante por WhatsApp.
- Libro de Reclamaciones virtual, términos, privacidad (Ley 29733), envíos, cambios y medios de pago.
- Seguridad: HTTPS/HSTS, CSP, anti-clickjacking, precios recalculados en el servidor, nunca se guardan datos de tarjeta.
- Rendimiento: fotos WebP en dos tamaños, carga diferida, código dividido por página, caché de 1 año para archivos estáticos.

## Configurar
1. Edita `src/lib/config.ts` con tu RUC, razón social, titular de Yape/Plin y cuentas bancarias.
2. Edita precios, tallas y stock reales en `src/lib/products.ts`.
3. En Vercel → Settings → Environment Variables agrega `MP_ACCESS_TOKEN` (tu Access Token de producción de Mercado Pago) y `SITE_URL=https://maisoninti.com.pe`.

## Desarrollo
```bash
npm install
npm run dev
npm run build
```
