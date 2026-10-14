// GitHub Pages serves the repo root of main, so a deploy is: build, then copy
// dist/index.html over the root and replace the root assets folder. Run with `npm run publish-root`,
// then commit and push.
import { cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const app = fileURLToPath(new URL('..', import.meta.url));
const root = join(app, '..');

// Replace root assets wholesale so files from old builds don't pile up.
rmSync(join(root, 'assets'), { recursive: true, force: true });
cpSync(join(app, 'dist', 'index.html'), join(root, 'index.html'));
cpSync(join(app, 'dist', 'assets'), join(root, 'assets'), { recursive: true });
console.log('Copied dist to repo root.');
