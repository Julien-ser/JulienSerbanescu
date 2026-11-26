// Run: node --test scripts/
import test from 'node:test';
import assert from 'node:assert';
import { body, homeSnapshot, inline, parseEntry } from './build-log-pages.mjs';

test('frontmatter parses, CRLF tolerated', () => {
  const e = parseEntry('2026-11-13-zero-vram.md', '---\r\ntitle: Zero VRAM\r\ndate: 2026-11-13\r\n---\r\nHello');
  assert.deepStrictEqual([e.slug, e.title, e.date, e.body], ['2026-11-13-zero-vram', 'Zero VRAM', '2026-11-13', 'Hello']);
});

test('text is escaped; only http links become anchors', () => {
  assert.strictEqual(inline('<script>x</script>'), '&lt;script&gt;x&lt;/script&gt;');
  assert.strictEqual(inline('[a](javascript:alert(1))'), '[a](javascript:alert(1))');
  assert.strictEqual(inline('**b** `c` [d](https://e.ca)'), '<strong>b</strong> <code>c</code> <a href="https://e.ca" rel="noopener noreferrer">d</a>');
});

test('blocks: heading, list, known image, unknown image dropped', () => {
  const html = body('## Head\n\n- one\n- two\n\n![alt](a.png)\n\n![x](missing.png)\n\nplain', new Set(['a.png']));
  assert.match(html, /<h2>Head<\/h2>/);
  assert.match(html, /<ul><li>one<\/li><li>two<\/li><\/ul>/);
  assert.match(html, /<img src="..\/img\/a.png" alt="alt"/);
  assert.doesNotMatch(html, /missing\.png/);
  assert.match(html, /<p>plain<\/p>/);
});

test('home snapshot: llms.txt facts land inside #root as plain HTML', () => {
  const llms = '# Julien Serbanescu\n\n> One-liner with <b>.\n\n## Papers\n- [FalseCoTQA](https://doi.org/x): SIGIR-AP 2025.';
  const html = homeSnapshot(llms, '<body><div id="root"></div><script type="module" src="a.js"></script></body>');
  assert.match(html, /<div id="root"><main class="static-home">/);
  assert.match(html, /<h1>Julien Serbanescu<\/h1>/);
  assert.match(html, /<p>One-liner with &lt;b&gt;.<\/p>/);
  assert.match(html, /<li><a href="https:\/\/doi.org\/x" rel="noopener noreferrer">FalseCoTQA<\/a>: SIGIR-AP 2025.<\/li>/);
  assert.match(html, /<\/main><\/div><script type="module"/);
});

test('home snapshot fails loudly when the empty root is missing', () => {
  assert.throws(() => homeSnapshot('# x', '<div id="app"></div>'), /root/);
});
