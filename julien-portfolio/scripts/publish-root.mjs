// GitHub Pages serves the repo root of main, so a deploy is: build, then copy
// dist/index.html and dist/assets over the root. Run with `npm run publish-root`,
// then commit and push.
import { cpSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const app = fileURLToPath(new URL('..', import.meta.url));
const root = join(app, '..');

for (const f of readdirSync(join(root, 'assets'))) {
  if (/^index-.*\.(js|css)$/.test(f)) rmSync(join(root, 'assets', f));
}
cpSync(join(app, 'dist', 'index.html'), join(root, 'index.html'));
cpSync(join(app, 'dist', 'assets'), join(root, 'assets'), { recursive: true });
console.log('Copied dist to repo root.');
