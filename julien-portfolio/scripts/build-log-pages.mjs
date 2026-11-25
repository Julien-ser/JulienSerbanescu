// After `vite build`: one static, crawlable page per Captain's Log entry at log/<slug>/,
// an index at log/, and a sitemap that lists them all. The site itself is a single-page app,
// so without this Google only ever sees one URL.
// Markdown subset matches CaptainsLog.jsx renderBody: paragraphs, ## headings, "- " lists,
// images from logs/img, **bold**, `code`, http links, ```mermaid (shown as source here).
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = fileURLToPath(new URL('..', import.meta.url));
const SITE = 'https://julien-ser.github.io/JulienSerbanescu/';
const LOGS = join(app, 'src', 'logs');
const OUT = join(app, 'dist', 'log');

export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function parseEntry(file, raw) {
  const text = raw.replace(/\r\n/g, '\n');
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = {};
  if (m) for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { slug: file.replace(/\.md$/, ''), ...meta, body: (m ? m[2] : text).trim() };
}

export function inline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return `<strong>${esc(part.slice(2, -2))}</strong>`;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return `<code>${esc(part.slice(1, -1))}</code>`;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return `<a href="${esc(link[2])}" rel="noopener noreferrer">${esc(link[1])}</a>`;
    return esc(part);
  }).join('');
}

export function body(md, images) {
  return md.split(/\n{2,}/).map((block) => {
    const lines = block.split('\n');
    const diagram = block.match(/^```mermaid\n([\s\S]*?)\n```$/);
    if (diagram) return `<pre class="diagram">${esc(diagram[1])}</pre>`;
    const img = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) return images.has(img[2]) ? `<img src="../img/${esc(img[2])}" alt="${esc(img[1])}" loading="lazy">` : '';
    if (block.startsWith('## ')) return `<h2>${esc(block.slice(3))}</h2>`;
    if (lines.every((l) => l.startsWith('- '))) return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${inline(lines.join(' '))}</p>`;
  }).join('\n');
}

const STYLE = `:root{color-scheme:dark}body{margin:0;background:#121715;color:#e8ebe5;font:17px/1.7 'IBM Plex Sans',system-ui,sans-serif}
main{max-width:720px;margin:0 auto;padding:40px 20px 80px}a{color:#e3bd6a}nav{font:13px 'Space Mono',monospace;display:flex;gap:18px;flex-wrap:wrap}
h1{font:700 clamp(2rem,6vw,2.8rem)/1.1 'Chakra Petch',sans-serif;margin:28px 0 8px}h2{font:600 1.35rem 'Chakra Petch',sans-serif;margin:36px 0 8px}
.meta{font:13px 'Space Mono',monospace;color:#b59a5c}img{max-width:100%;border-radius:4px}code,pre{font-family:'Space Mono',monospace;font-size:.85em;background:#0d100f;border-radius:3px}
code{padding:1px 5px}pre{padding:14px;overflow:auto;white-space:pre-wrap}li{margin:6px 0}.list li{list-style:none;margin:0 0 22px}.list{padding:0}.list p{margin:4px 0;color:#c9cec9}`;

function page({ title, description, path, content, jsonld }) {
  const url = SITE + path;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}"><link rel="icon" type="image/svg+xml" href="${SITE}favicon.svg">
<meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${SITE}og-image.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=IBM+Plex+Sans:wght@400;600&family=Space+Mono&display=swap" rel="stylesheet">
<style>${STYLE}</style>
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script></head>
<body><main><nav><a href="${SITE}">Julien Serbanescu</a><a href="${SITE}log/">Captain's Log</a></nav>
${content}</main></body></html>
`;
}

export function build() {
  const files = readdirSync(LOGS).filter((f) => f.endsWith('.md'));
  const entries = files.map((f) => parseEntry(f, readFileSync(join(LOGS, f), 'utf8'))).sort((a, b) => b.slug.localeCompare(a.slug));
  const imgDir = join(LOGS, 'img');
  const images = new Set(existsSync(imgDir) ? readdirSync(imgDir) : []);
  mkdirSync(OUT, { recursive: true });
  if (images.size) cpSync(imgDir, join(OUT, 'img'), { recursive: true });
  const author = { '@type': 'Person', name: 'Julien Serbanescu', url: SITE };
  for (const e of entries) {
    const description = e.summary || `Captain's Log, stardate ${e.stardate}.`;
    mkdirSync(join(OUT, e.slug), { recursive: true });
    writeFileSync(join(OUT, e.slug, 'index.html'), page({
      title: `${e.title} · Captain's Log · Julien Serbanescu`, description, path: `log/${e.slug}/`,
      content: `<h1>${esc(e.title)}</h1><p class="meta">Stardate ${esc(e.stardate || '')} · ${esc(e.date || '')}</p>\n${body(e.body, images)}`,
      jsonld: { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: e.title, datePublished: e.date, description, author, url: `${SITE}log/${e.slug}/` },
    }));
  }
  writeFileSync(join(OUT, 'index.html'), page({
    title: "Captain's Log · Julien Serbanescu",
    description: 'What I am learning, recorded a few times a week: security, agents, hardware and local models. Newest first.',
    path: 'log/',
    content: `<h1>Captain's Log</h1><p>What I'm learning, recorded a few times a week. Newest first.</p><ul class="list">${entries.map((e) =>
      `<li><a href="${SITE}log/${e.slug}/">${esc(e.title)}</a> <span class="meta">${esc(e.date || '')}</span>${e.summary ? `<p>${esc(e.summary)}</p>` : ''}</li>`).join('')}</ul>`,
    jsonld: { '@context': 'https://schema.org', '@type': 'Blog', name: "Captain's Log", author, url: `${SITE}log/` },
  }));
  const urls = [[SITE, entries[0]?.date], [`${SITE}log/`, entries[0]?.date], ...entries.map((e) => [`${SITE}log/${e.slug}/`, e.date])];
  writeFileSync(join(app, 'dist', 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `  <url><loc>${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`);
  return entries.length;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  console.log(`Built ${build()} log pages.`);
}
