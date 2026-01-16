#!/usr/bin/env node
// Minimal Firecrawl helper using the REST API. Requires Node 18+ (global fetch).
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

loadDotEnv();
const args = parseArgs(process.argv.slice(2));

if (args.help || !args.url) {
  printUsage();
  process.exit(args.help ? 0 : 1);
}

const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.error('Missing FIRECRAWL_API_KEY environment variable.');
  process.exit(1);
}

const mode = args.mode ?? 'scrape';
if (!['scrape', 'crawl'].includes(mode)) {
  console.error(`Invalid mode: ${mode}. Use scrape or crawl.`);
  process.exit(1);
}

const formats = normalizeFormats(args.formats);
const timeoutMs = parseNumber(args.timeout, 60000);
const endpoint = mode === 'crawl' ? 'crawl' : 'scrape';

const body = {
  url: args.url,
  formats
};

if (mode === 'crawl') {
  body.limit = parseNumber(args.limit, 10);
  body.maxDepth = parseNumber(args.maxDepth, 1);
  body.allowSubdomains = toBoolean(args.allowSubdomains, false);
  body.allowExternalLinks = toBoolean(args.allowExternalLinks, false);
}

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), timeoutMs);

try {
  const response = await fetch(`https://api.firecrawl.dev/v0/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    signal: controller.signal
  });

  clearTimeout(timer);

  const text = await response.text();
  if (!response.ok) {
    console.error(`Request failed (${response.status}): ${text}`);
    process.exit(1);
  }

  try {
    const parsed = JSON.parse(text);
    console.log(JSON.stringify(parsed, null, 2));
  } catch {
    console.log(text);
  }
} catch (err) {
  clearTimeout(timer);
  console.error('Error calling Firecrawl:', err.message ?? err);
  process.exit(1);
}

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      options.help = true;
      continue;
    }

    if (!arg.startsWith('--')) {
      if (!options.url) options.url = arg;
      continue;
    }

    const rawKey = arg.slice(2);
    const key = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];

    if (rawKey.includes('=')) {
      const [k, v] = rawKey.split('=');
      options[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
      continue;
    }

    if (next && !next.startsWith('--')) {
      options[key] = next;
      i += 1;
    } else {
      options[key] = true;
    }
  }
  return options;
}

function parseNumber(value, fallback) {
  if (value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toBoolean(value, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (['true', '1', 'yes', 'y', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n', 'off'].includes(normalized)) return false;
  }
  return fallback;
}

function normalizeFormats(value) {
  if (!value) return ['markdown'];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);
}

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function printUsage() {
  console.log(`Usage: node src/firecrawl.js --url <https://site> [options]

Options:
  --mode <scrape|crawl>        Mode to use (default: scrape)
  --formats markdown,html      Comma-separated output formats (default: markdown)
  --limit <n>                  Max pages to fetch when crawling (default: 10)
  --maxDepth <n>               Max link depth when crawling (default: 1)
  --allowSubdomains <bool>     Allow crawling subdomains (default: false)
  --allowExternalLinks <bool>  Allow crawling external domains (default: false)
  --timeout <ms>               Request timeout in ms (default: 60000)
  -h, --help                   Show this message

Examples:
  node src/firecrawl.js --url https://example.com
  node src/firecrawl.js --url https://example.com --mode crawl --limit 5 --maxDepth 2
`);
}
