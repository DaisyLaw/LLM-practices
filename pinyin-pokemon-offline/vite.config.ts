import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Safari refuses to run <script type="module"> under the file:// protocol
// (treats every local file load as cross-origin and blocks it). Since the
// build below outputs plain IIFE code with no import/export syntax left,
// it's safe to strip the module attributes so double-clicking index.html
// works in Safari too.
function stripModuleAttrs(): Plugin {
  return {
    name: 'strip-module-attrs-for-safari-file-protocol',
    apply: 'build',
    // vite-plugin-singlefile inlines everything at writeBundle time, so we
    // must patch the on-disk file afterwards (closeBundle runs after that).
    closeBundle() {
      const outFile = path.resolve(__dirname, 'dist/index.html');
      if (fs.existsSync(outFile)) {
        let html = fs.readFileSync(outFile, 'utf8');

        // Extract the main bundle <script type="module" crossorigin>...</script>
        // block from <head> and move it to just before </body>, as a plain
        // (non-module) script. This guarantees #root already exists in the
        // DOM by the time the script runs, and avoids Safari's file://
        // CORS block on <script type="module">.
        const scriptMatch = html.match(
          /<script type="module" crossorigin>([\s\S]*?)<\/script>\s*/
        );
        if (scriptMatch) {
          html = html.replace(scriptMatch[0], '');
          html = html.replace('</body>', `<script>${scriptMatch[1]}</script>\n  </body>`);
        }

        fs.writeFileSync(outFile, html);
      }
    },
  };
}

// Fully offline build: everything (JS, CSS, images, audio logic) is inlined
// into a single index.html with no external network requests.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), stripModuleAttrs()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 20000,
    target: 'es2018',
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
});
