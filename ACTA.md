# Acta de trabajo

- Fecha: (rellenar).
- Responsable: (rellenar).

## Alcance y cambios realizados
- Landing renovada con hero en imagen completa (`imagen/hero_illustration.png`), sin fondo extra; hero responsive con altura limitada.
- Layout concentrado: Ancho máximo de `840px` en contenido principal y footer para mejorar la legibilidad en monitores anchos.
- Identidad visual: Integración de logos oficiales (`imagen/logo.png` en sección media, `imagen/footer_illustration.png` y `imagen/footer_logo.png` en footer).
- Cinta de claims con loop infinito, fuente Contrail One y color #ef80d4, sin espacios ni cortes.
- Sección de precios: etapas separadas (`Etapa 1`, `Etapa 2` en #146ccb), nombres en Contrail One y color #ff77d7, helpers en Poppins (inscripción/fechas en dos líneas) y precios debajo; nota de términos centrada en #146ccb.
- Formulario de inscripción conectado al endpoint de Apps Script; validación de cliente, honeypot, soporte para adjunto (<2MB png/jpg/pdf) convertido a base64.
- Optimización móvil: Botón CTA "Inscribir equipo" pegajoso (sticky) y reorganización de tabla de precios en modo columna.
- Estilos reestructurados en `index.css`; tipografías añadidas (Contrail One, Poppins, Inter/Bungee).

## Backend (Apps Script)
- Archivo de referencia: `cod.gs` (peg ar en Apps Script):
  - Sheet ID: `14QAUOe1UY8ivgL_7Wx1DxzsCmI_yP6e-o63CO16aRiw`
  - Hoja: `Experience League`
  - Carpeta Drive comprobantes: `1VTrpOfxsnZB_1gcZ2wsI7dU0P4Ht5k9L`
  - Límite adjunto: 2MB, guarda archivo en Drive y URL en la fila.
  - Token opcional `requiredToken` (vacío).
- Endpoint actual usado en la landing: `https://script.google.com/macros/s/AKfycbzAatNXap_HsvMlZT9j4UIYJxSNf7-gPWI19SDvImOBTBeNIqnNfMNyF5wIUMPnhHmwDA/exec`
- Guía rápida y prueba CORS en `APPS_SCRIPT.md`.

## Archivos clave
- `index.html`: estructura de la landing, hero, marquee, pricing, formulario, endpoint.
- `index.css`: estilos, tipografías, layout responsive, pricing, marquee.
- `cod.gs`: `doPost` para Sheets + Drive (referencia para Apps Script).
- `APPS_SCRIPT.md`: pasos para probar y añadir header CORS si se necesita.
- `.env.example`, `package.json`, `README.md`, `.gitignore`.

## Pendientes / siguientes pasos
- Redeploy del web app tras cualquier cambio en `cod.gs`; copiar nueva URL `/exec` si cambia.
- Prueba end-to-end del formulario con archivo <2MB, verificar fila en hoja y archivo en carpeta.
- (Opcional) Añadir header CORS en `doPost` y redeploy.
- (Opcional) Añadir SEO/OG/JSON-LD, FAQs, agenda, mapa, logos.
- Mantener `.env` fuera de git (API keys).
