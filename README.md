# Firecrawl helper

CLI simple para probar el REST API de Firecrawl (scrape o crawl) desde Node 18+ sin dependencias extra.

## Requisitos
- Node 18 o superior (usa `fetch` global).
- Variable `FIRECRAWL_API_KEY` (ponla en `.env` o expórtala en la shell).

## Setup rapido
1. Copia `.env.example` a `.env` y pega tu API key en `FIRECRAWL_API_KEY`.
2. (Opcional) `npm run scrape -- --help` para ver las flags.

## Comandos
- Scrape de una URL:
  ```bash
  node src/firecrawl.js --url https://example.com --formats markdown,html
  ```
- Crawl limitado:
  ```bash
  node src/firecrawl.js --url https://example.com --mode crawl --limit 5 --maxDepth 2 --allowSubdomains false
  ```

## Notas
- `.env` se carga automaticamente desde el directorio actual si existe.
- Por defecto el crawl usa `--limit 10` y `--maxDepth 1` para evitar golpes grandes; súbelo solo si lo necesitas.
- Respeta robots.txt y los terminos del sitio; Firecrawl puede seguir enlaces segun los flags que pases.
