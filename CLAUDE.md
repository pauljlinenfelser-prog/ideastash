# IdeaStash — project notes for Claude Code

Mike's own free Deepstash-style app: bite-size "idea cards" from books and jw.org, delivered
in small daily doses. Phone web app (PWA), no server, no account, no build step.
Mike does not code by hand — explain changes in plain language.

## Mike's rules (always follow)
- ONE change at a time. Each delivered change = a new version.
- Every version gets a full copy in `versions/vN/` (copy of `app/`). `ROLLBACK.bat` restores any version.
- Update README.txt "VERSIONS" list with each release.
- No holiday greetings.

## Layout
- `app/` — the live app. `index.html` (all UI + logic, vanilla JS), `sources.js` (static source lists),
  `sw.js` (offline cache — bump `CACHE` name each release), `manifest.json`, icons.
- `versions/v1`, `versions/v2` — frozen copies.
- `index.html` (root) — redirects to `app/` for GitHub Pages.
- `DEPLOY.bat` — git add/commit/push; first run creates repo `ideastash` on Mike's personal GitHub
  (pauljlinenfelser-prog) and enables Pages from main /. Phone link: https://pauljlinenfelser-prog.github.io/ideastash/
- `ROLLBACK.bat` — copies `versions\vN\*` into `app\`, then run DEPLOY.bat.

## How it works (v2)
- Data in localStorage key `ideastash.v1` (ideas, stashes, daily, streak, seen, shelf). Book paragraph
  cache in IndexedDB `ideastash` / store `kv` key `book:<shelfId>`.
- Cross-site pages are read via the free reader `https://r.jina.ai/<url>` (CORS-enabled, returns markdown).
  jw.org / wol.jw.org / gutenberg.org do NOT allow direct browser fetch. Rate limits exist (anonymous).
  Fallback idea for later: Mike's own free Cloudflare Worker relay.
- Gutenberg search: gutendex.com (slow, sometimes ~15s), fallback = Gutenberg search page via reader.
- Shelf kinds: `daily` (wol daily text, parsed by "## Weekday, Month D" sections), `qfr` (553 Questions
  From Readers from the Watchtower Index, wol docid 1200274728), `bqa` (191 Bible Questions Answered,
  jw.org), `book` (Gutenberg). Random order = full-cycle permutation (pos*step+seed) % total, no repeats.
- Each morning `renderFeed` → `pullShelf()` adds that day's cards (`pulledOn` = today), then
  `ensureDaily()` builds Today (shelf cards first, topped up to 5 with unseen cards).
- jw.org content is copyrighted — personal use only.

## Roadmap (agreed with Mike, in this order)
- v3 **Watch tab**: jw.org video catalog API `https://b.jw-cdn.org/apis/mediator/v1/categories/E/<key>?detailed=1&clientType=www`
  (CORS open; MP4 files play directly). Mike picks categories once; feed fills itself with unseen videos.
  Per-category length limit. Key categories: `VODPgmEvtMorningWorship` (Morning Worship, ~440 videos,
  ~10 min, headshot → crop to fill vertical screen), `StudioNewsReports` (News & Announcements / Governing
  Body Updates), plus Bible, Interviews & Experiences, Children, Music. Widescreen videos: blurred-fill
  background by default. Save videos to stashes. Also jw.org Newsroom articles as shelf cards.
  Still to verify: whether JW Pressroom social clips (TikTok/Instagram) are on jw.org at all.
- v4 **Own e-books**: "add from my files" (EPUB / TXT) onto the shelf. Kindle/Audible are DRM-locked.
- v5 **Limited drops + Listening mode**: no endless scroll. Scheduled drops (e.g. morning/noon/evening),
  5 items each (cards + videos), then a "That's it — next drop at noon" screen with countdown.
  Listening/driving mode is the exception: UNLIMITED while hands-free — black screen, Wake Lock to keep
  playing, reads cards aloud (speechSynthesis) and plays video/audio clips back to back. Rule: limit the
  scrolling, not the listening.
- Later: **Share target** (share a page or TikTok/IG link into IdeaStash), and **IdeaStash Studio** — a
  separate PC tool: audiobook (DRM-free MP3, e.g. Libro.fm) + cover → Whisper transcript with word
  timestamps → AI picks self-contained 30–60s passages that end on complete thoughts → vertical
  captioned videos (audiogram / animated captions; background = article images with pan/zoom, else
  blurred book cover, else gradient). One-time batch per book; Mike reviews; publishes to the Pages
  site so the phone app drips them out. Optional export for manual posting / Buffer. No auto-reading
  of TikTok/IG feeds (not allowed). Mike's goal: get off TikTok's For You feed.
- Copyright note for Studio: fine for personal use; public posting of copyrighted audiobook clips risks takedowns.
