// GitHub Pages serves the repo root of main, so a deploy is: build, then copy
// dist/index.html over the root and replace the root assets folder. Run with `npm run publish-root`,
// then commit and push.
import { cpSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const app = fileURLToPath(new URL('..', import.meta.url));
const root = join(app, '..');

// Replace root assets wholesale so files from old builds don't pile up.
rmSync(join(root, 'assets'), { recursive: true, force: true });
// Copy everything at the top of dist: index.html, assets/, and whatever public/ holds
// (sitemap.xml, og-image.jpg, favicon, PDFs). Copying only index.html + assets used to drop those.
for (const entry of readdirSync(join(app, 'dist'))) {
  cpSync(join(app, 'dist', entry), join(root, entry), { recursive: true });
}
console.log('Copied dist to repo root.');
