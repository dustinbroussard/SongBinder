# SongBinder

SongBinder is a modern, touch-friendly web app for managing songs, setlists, and lyrics. It is local-first, offline-capable, and optimized for live performance on phones and tablets.

## Features
- Local-first storage in your browser (IndexedDB + localStorage) with a persistent storage request to reduce eviction.
- Batch song import: .txt, .docx, .json, .csv.
- Title cleanup and lyric normalization on import.
- Setlist management: create, rename, duplicate, delete, reorder with drag-and-drop or move buttons.
- Fuzzy setlist import from pasted text or .txt/.docx files.
- OCR setlist import from an image using Tesseract, with fuzzy title matching.
- Fast search across titles and lyrics, plus favorites-only filtering and sorting by title or last edit.
- Voice search on Songs and Lyrics tabs (Web Speech API).
- Performance mode: fullscreen lyrics, swipe/tap navigation, keyboard arrows, per-song font sizes, autoscroll with delay/speed, resume prompt, optional chord display, instant light/dark toggle.
- Export and backup:
  - Songs: JSON (array), JSON (library format), CSV, TXT (single file), TXT (separate files), PDF.
  - Setlists: JSON, TXT (track list), TXT (track list + lyrics), PDF.
  - Everything: JSON (songs + setlists) or songs-only JSON.
- Full editor (optional): chords, metadata (key/tempo/time signature/tags/notes), undo/redo, copy options, voice dictation, read-only performance view, and AI tools via OpenRouter (requires an API key).

## Installation and usage
1) Quick start (web/PWA)
- Open `index.html` directly, or serve the folder with `npx serve .` or any static server.
- For service worker and best offline support, use `http://localhost` or `https://` instead of `file://`.
- Install as a PWA from your browser if desired.

2) Add songs
- Go to the Songs tab.
- Use Upload to add .txt, .docx, .json, or .csv files, or create a new song.

3) Build setlists
- Go to the Setlists tab.
- Create a setlist and drag songs into it.
- Use Import for text/docx lists or Import from Image for OCR.

4) Perform
- Go to the Lyrics tab.
- Select a setlist (or All Songs) and click Start.

## Tabs and views
Songs tab
- Search titles/lyrics, filter favorites, and sort A-Z/Z-A or by edit time.
- Open the menu on a song for quick edit, full editor, copy, favorite, or delete.
- Long-press a song to copy title + lyrics.

Setlists tab
- Drag songs between Available Songs and Current Setlist.
- Reorder with drag-and-drop or move buttons.
- Import from text/docx or from an image (OCR).

Lyrics tab (performance list)
- Search within the selected setlist.
- Start opens the full-screen performance view.

Performance view
- Swipe or tap left/right zones to change songs.
- Adjustable font size with per-song memory.
- Autoscroll with per-song speed and delay.
- Optional chord overlay toggle.
- Light/dark toggle, resume last setlist position, and tap feedback.

Editor (full editor)
- Open from a song menu (Full Editor) or when creating a new song from the empty state.
- Edit lyrics and chords, manage metadata, undo/redo, and export/copy formats.
- Voice dictation supports "next line" / "previous line" commands.
- AI tools (reword, rewrite, continue, suggest chords, etc.) use OpenRouter; set your API key in Editor -> AI Settings.

## Import/export formats
Songs import
- .txt (one song per file)
- .docx (text only)
- .csv (Title, Lyrics)
- .json: array of songs or `{ songs: [...] }`

Setlist import
- .txt/.docx (one song title per line, fuzzy matched)
- .json setlist exports from SongBinder
- Image (OCR) with fuzzy matching

Backups
- Export modal includes a backup reminder with a configurable interval.

## Offline and PWA
- Service worker caches the main app, editor, and performance shells plus local assets.
- OCR uses local Tesseract worker/core and fetches language data; it falls back to the tessdata CDN if local headers are misconfigured.
- `file://` mode works, but service workers do not run; performance mode falls back to an `ids=` query to preserve setlist order.

## Data and privacy
- No accounts, no cloud by default. All data stays in this browser.
- API keys for the editor are stored locally in this browser.
- Export backups periodically; clearing site data removes songs and setlists.

## Dependencies
- Fuse.js (fuzzy search)
- SortableJS (drag-and-drop)
- Mammoth.js (DOCX parsing)
- Tesseract.js (OCR)
- idb (IndexedDB helper)
- FontAwesome (icons)
- Neonderthaw font (local)

## Development
- No build step. Edit HTML/CSS/JS directly.
- Lint: `npm run lint`
- Format: `npm run format`
- `config.js` controls editor defaults (chords mode, autosave, etc.).

## Troubleshooting
- Service worker not updating: hard refresh (Ctrl/Cmd+Shift+R) or unregister in DevTools.
- OCR errors: ensure `lib/tesseract/eng.traineddata.gz` is served without Content-Encoding and with a non-text content type.
- PDF export blocked: allow pop-ups for the site.
- Voice search/dictation not working: check browser support and mic permissions.
- AI tools not working: set an OpenRouter API key in Editor -> AI Settings.

## Screenshots
Add screenshots under `assets/screenshots/`:

- Songs tab: `assets/screenshots/songs.png`
- Setlists tab (with OCR import button): `assets/screenshots/setlists.png`
- OCR import flow: `assets/screenshots/ocr-import.png`
- Lyrics list: `assets/screenshots/lyrics-list.png`
- Performance mode: `assets/screenshots/performance.png`
- Editor: `assets/screenshots/editor.png`
- PDF export preview: `assets/screenshots/pdf-export.png`

Example markdown (uncomment after adding files):

<!--
![Songs](assets/screenshots/songs.png)
![Setlists](assets/screenshots/setlists.png)
![OCR Import](assets/screenshots/ocr-import.png)
![Lyrics List](assets/screenshots/lyrics-list.png)
![Performance](assets/screenshots/performance.png)
![Editor](assets/screenshots/editor.png)
![PDF Export](assets/screenshots/pdf-export.png)
-->
