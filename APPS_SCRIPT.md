# Apps Script conexión (Sheets + Drive)

Puntos pendientes que preguntaste (2 y 3):

## 2) Probar desde la consola del navegador
Abre DevTools en cualquier página y ejecuta (reemplaza la URL con tu `/exec` vigente):
```js
fetch('https://script.google.com/macros/s/AKfycbyFdEH9wIx2eOH2YtRlgHDEwlfsTB9DS-a_tJVqlWIDG7dN46peBzCu7pIwQ9WWqCIH5A/exec', {
  method: 'POST',
  body: JSON.stringify({ ping: true })
})
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
```
- Si esto falla con CORS, el problema es del lado de la implementación/URL del web app.
- Si responde OK, revisa que la landing use exactamente la misma URL `/exec` y que no haya extensiones bloqueando.

## 3) Agregar header CORS en `doPost` (Apps Script)
En tu `Code.gs`, envuelve el `ContentService` con el header `Access-Control-Allow-Origin`. Aplica tanto en éxito como en error. Ejemplo:
```js
function doPost(e) {
  try {
    // ... tu lógica de sheet + Drive ...
    // OJO: usa el ID correcto de tu sheet, ej. '14QAUOe1UY8ivgL_7Wx1DxzsCmI_yP6e-o63CO16aRiw'
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}
```
Luego guarda y vuelve a “Implementar” → “Nueva implementación” (o actualizar la existente) como App web, Ejecutar como “Yo”, Acceso “Cualquiera”. Usa la URL `/exec` que se genere al redeploy.
