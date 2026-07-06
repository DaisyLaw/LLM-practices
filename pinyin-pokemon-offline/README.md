# 拼音宝可梦 (Pinyin Pokémon Adventure) — Offline Edition

This is a fully offline version of the original AI-Studio-scaffolded game.
No AI, no server, no internet connection required — the game and UI are
completely unchanged.

## What changed from the original repo

The original code was already 100% playable without any AI calls (the
`@google/genai` dependency was present but never actually used). The only
things that needed the internet were:

1. **Pokémon artwork** — was fetched live from `raw.githubusercontent.com`.
   → Now bundled locally: all 482 sprites were downloaded, resized to
   160×160, compressed to WebP, and embedded directly in the code as
   base64 data.
2. **Poké Ball icon** — same GitHub source, same fix (bundled locally).
3. **Removed unused packages**: `@google/genai`, `express`, `dotenv` and
   related server scaffolding that AI Studio adds by default but this game
   never used.
4. **Pronunciation audio** still uses the browser's built-in Web Speech
   API (`speechSynthesis`) — this is a native browser/OS feature, not a
   cloud AI service, and works offline as long as the device has a
   Chinese (zh-CN) voice installed (true on virtually all modern phones,
   Windows, and macOS installs out of the box).
5. Build is now bundled into a **single self-contained `index.html`** file
   using `vite-plugin-singlefile`, so it can be opened directly by
   double-clicking — no local server, no install step required.

## How to use

Just open **`index.html`** in any modern browser (Chrome, Edge, Safari,
Firefox) on Windows, macOS, Linux, or Android — double-click it, or drag
it into a browser window. No internet connection is needed after that.

> Note: on iOS, Safari may block audio playback on the very first tap in
> some rare configurations — tapping the speaker icon again resolves it.
> This is a standard iOS browser policy, unrelated to this app.

## Rebuilding from source (optional)

If you want to modify the game and rebuild it:

```bash
npm install
npm run build
```

The output is written to `dist/index.html` — a single offline-ready file.

```bash
npm run dev   # for local development with hot reload
```
