# IdeaStash: handoff to Claude Code

*Written 2026-11-16 from the claude.ai chat where v1 and v2 were built. Read this before you change anything.*

## 1. What this is
IdeaStash is Mike's own free version of Deepstash. It delivers bite-size "idea cards" from books and jw.org in small daily doses. It's a phone web app (PWA): plain HTML/JS, no server, no account, no build step, hosted free on GitHub Pages.

**The point of the app:** Mike wants to get off TikTok's endless For You feed. IdeaStash keeps the good daily habit but **limits the scrolling**. The exception is **listening**: hands-free use (driving, moving around the room) can run without a limit.

## 2. Mike's working rules (always follow)
- Mike doesn't code by hand. Explain changes in plain language and give him exact click-by-click steps.
- **One change at a time.** Each delivered change is its own version.
- **Every version** gets a full copy of `app/` in `versions/vN/`. `ROLLBACK.bat` restores any version.
- Add each release to the VERSIONS list in `README.txt`, and bump `CACHE` in `app/sw.js` (`ideastash-vN`) so phones pick up the update.
- Deploy with `DEPLOY.bat` (git add/commit/push to GitHub Pages).
- No holiday greetings.

## 3. Where things stand
- **v1** (done): Today feed (scroll-snap cards, 5 a day, streak), stashes, Add tab (Gutenberg search, jw.org/wol links, paste, write one), JSON backup.
- **v2** (done): **My Shelf**. Sources Mike picks feed new cards into Today every morning:
  - Daily Text (wol.jw.org)
  - Questions From Readers: 553 items, a static list in `app/sources.js`
  - Bible Questions Answered: 191 items, a static list in `app/sources.js`
  - Gutenberg books (cached in IndexedDB)

  Each shelf item has a per-day count, In order / Random (no repeats), pause, start over and remove.
- **v6** (done, deployed 2026-11-16): TikTok-style hearts. A ❤️/🤍 button on cards (after 🔊) and on videos (top of the side column) toggles the `fav` stash. Double-tap is a document click listener for cards (two clicks within 350 ms and 40 px, not on buttons); on videos, a single tap waits 280 ms so it can tell a double-tap apart. Double-tap only hearts and never un-hearts, and shows `heartBurst()` where you tapped. An un-hearted video that's in no stash is removed from ideas. `ensureFav()` recreates Favorites if needed.
- **v8** (done, current, deployed 2026-11-16): **one feed.** Mike wants cards and videos together in Today, in this order: Daily Text → video 1 (Morning Worship) → video 2 → QFR card(s) → video 3 → BQA card(s) [`data-core` = streak point] → the rest of today's cards and videos alternating. After that, `appendExplore()` adds 4 cards plus 2 `moreVideos()`: short unseen extras from channels in turn, never Morning Worship, respecting `maxMin` and the one-long rule. Extras are kept in `watch.daily.items` with `extra:true` at the end. The 5-card limit and "explore" end slide are gone, replaced by `db.limitMin` (More: 5/10/20/30/60/None, default 20) and `db.usage[today]` seconds, counted only while Today is on screen. When time is up, the next swipe hits `cutFeedAt()` → "That's your time for today" (the current video isn't cut). Reopening shows the Daily Text plus that screen. The Watch tab was removed: Video channels are a row on Shelf, and video links are under Add → Video link (a pasted video plays right after the Daily Text). `renderWatch`/`pasteVideoSheet` were deleted, but the video helpers remain. Untested on the phone: real swipe feel, autoplay with sound, and the time counter across app switches.
- **v7** (done, deployed 2026-11-16): new icon. Mike chose the oil lamp (Ps. 119:105) and kept the name IdeaStash, turning down Daily Manna, Gleanings and Lamplight. The source is `art/icon-lamp.svg`, rendered to PNG with headless Chrome. The lamp sits inside the maskable safe circle.
- **v5** (done, deployed 2026-11-16): the **Watch tab**. `db.watch = {cats:[{key,perDay,maxMin}], seen:{lank:1}, daily:{date,items,done}, sound}`. `buildWatchDaily()` takes the newest unseen videos from each channel within `maxMin`, records each channel in `daily.done`, and caches the catalog in `catCache` for the session. **Mike's rule:** Morning Worship (`CROP`, cropped to fill) always comes in; besides it, only ONE video over 5 min (`LONG_SECS`) a day. He prefers short videos, but experiences may run longer, so the Interviews and Experiences channels default to 15 min and other channels to 5. Seeded channels (`db.seeded` 'w:KEY'): Morning Worship (any length), Truth Transforms Lives (15), Apply Bible Principles (5). The swipe feed autoplays muted ("Tap for sound" sets `watch.sound`), seen is marked when a video is in view, and an end slide says "That's today's videos". ＋ Link parses `lank` from share links and goes through `media-items/E/<lank>`. Saved videos become ideas with a `video` field and topic Video; they're kept out of Today and explore. All subcategory keys are in `WATCH_GROUPS`. Tested at 390×800 against the live catalog and MP4s. Untested on the phone: real sound after a tap, and Chrome Android's autoplay. Pressroom social clips: still not looked into.
- **v4** (done, deployed 2026-11-16; Mike asked to combine these): (1) a 🔊 Listen button, the first in each card's action row. `listen(id)` uses speechSynthesis, splits the text into sentences (Chrome Android cuts off long speech), prefers a Google en-US voice, and `speakable()` expands Bible references ("1 Cor. 13:4-7" → "First Corinthians 13, verses 4 to 7"). Tap again to stop. (2) `ensureDailyShelf()` adds QFR and BQA to the shelf once, using the `db.seeded` list, so a Remove sticks. Use the same list for future default sources (Morning Worship). (3) BQA card titles use the index question, because the page put a breadcrumb in the title. QFR titles drop a leading ◼. Listen was tested with stubbed speech only: real playback is unverified on his phone.
- **v3** (done, deployed 2026-11-16): Daily Text always on. `ensureDailyShelf()` runs at boot and after a backup import: it adds the daily shelf item if missing, unpauses it and keeps it first. `ensureDaily()` puts `todaysText()` (the idea with `pulledOn===today` and the daily `shelfId`) in slot 1, plus 4 others. If it's missing, `dailyRetryHTML()` shows a "couldn't load, tap to retry" card with a wol link, and `retryDaily()` resets `lastPull` and pulls again. The Shelf sheet hides Pause and Remove for Daily Text. Tested in the app pane at 390×800: live fetch, reader-down placeholder, retry.
- ~~Voice request~~: done in v4. Old note: He thought he already had it, but there's no speech code in IdeaStash or LCARS. Plan: a small 🔊 Listen button on cards (speechSynthesis) as its own version; v6 Listening mode builds on it.
- **Deploy status (confirmed 2026-11-16):** the repo exists on `pauljlinenfelser-prog`, Pages is built from main /, and the link loads.
- ~~Old note:~~ the first `DEPLOY.bat` run on Mike's PC failed at the commit step. Git most likely had no user.name/email, so `.git` exists with no commits. `DEPLOY.bat` has since been rewritten to set the Git identity from the GitHub account and pick up where it stopped. **First task: check that the repo `pauljlinenfelser-prog/ideastash` exists, Pages is on, and https://pauljlinenfelser-prog.github.io/ideastash/ loads.** Use Mike's **personal** GitHub (`pauljlinenfelser-prog`), not ALSON-RDLABS. gh may be signed in to either: check with `gh auth status`.
- v2 has never run live on a phone. The shelf was tested headless with real Gutenberg and Daily Text pages, plus jw.org sample pages, but not through the live reader service.

## 4. Project layout (`C:\Users\inspe\source\IdeaStash`)
```
CLAUDE.md        short rules + pointer to this file
HANDOFF.md       this file
README.txt       Mike-facing instructions + VERSIONS list
DEPLOY.bat       publish to GitHub Pages (first run creates repo + enables Pages from main /)
ROLLBACK.bat     copy versions\vN\* into app\, then run DEPLOY.bat
index.html       root redirect -> app/
app/             THE APP: index.html (all UI+logic), sources.js, sw.js, manifest.json, icons
versions/v1, v2  frozen full copies
```

## 5. How the code works (app/index.html)
- **Storage:** localStorage key `ideastash.v1` holds `{ideas, stashes, daily, streak, seen, shelf}`. This key is a data-format name, not the app version, so keep it. Book paragraphs are cached in IndexedDB db `ideastash`, store `kv`, key `book:<shelfId>`.
- **Idea object:** `{id, title, body, topic, source, url, created, stashes:[], shelfId?, pulledOn?}`. Topics have gradient colors in `TOPICS`.
- **Reading other sites:** jw.org, wol.jw.org and gutenberg.org do **not** allow direct browser fetch (no CORS). Pages go through the free reader **`https://r.jina.ai/<url>`**, which returns markdown with CORS. It is anonymous and rate-limited; it blocked our test server once. A possible later fix is Mike's own free Cloudflare Worker relay. `fetchText()` tries a direct fetch first, then the reader.
- **Gutenberg search:** gutendex.com, which is slow (around 15 s) and has a 15 s timeout. The fallback is Gutenberg's own search page through the reader.
- **Turning text into cards:** `paragraphs()` → `goodPara()` (140–1600 chars, 2+ sentences, not headings, menus or dialogue) → `makeTitle()` (first sentence) + `trimBody()`. Run `stripGutenberg()` **before** `cleanMarkdown()`, because the markdown cleanup eats the `***` markers.
- **Daily Text:** `getDailyCard()` reads `https://wol.jw.org/en/wol/h/r1/lp-e/YYYY/M/D` through the reader. The markdown has `## Saturday, November 14` sections, so the code picks today's. The theme scripture becomes the title and the comment the body; jw citation tails (`w24.12 12 ¶12-13`) are stripped.
- **Questions From Readers / Bible Questions Answered:** `articleCard()` fetches the article, finds the `?` paragraph that best matches the index question (word overlap) as the title, and takes the following good paragraphs (up to ~950 chars) as the body. QFR index links (`/wol/pc/...`) redirect to the article. How `sources.js` was built: QFR from the wol Watchtower Index page `1200274728` (`<p class="su|sv">` entries); BQA from https://www.jw.org/en/bible-teachings/questions/ (topic pages load by JS, so the list is only 191).
- **Shelf:** `db.shelf` items look like `{id, kind:'daily'|'qfr'|'bqa'|'book', title, sub, perDay, order:'seq'|'random', step, seed, pos, total, lastPull, paused, error}`. Random order uses `(pos*step+seed) % total` with gcd(step,total)=1, a full cycle with no repeats.
- **Each morning:** `renderFeed()` → `pullShelf()`. Items whose `lastPull !== today` add cards with `pulledOn = today`; an error is recorded and retried next open. Then `ensureDaily()` builds Today: shelf cards first, topped up to 5 with unseen cards. Finishing the 5 bumps the streak. **v2 still allows endless "explore" scrolling after the 5.** That is meant to go (see v6).
- **Service worker:** network-first for the app's own files, caches the shell, and never intercepts other sites.

## 6. Next steps, in order (one version each)

### v3: Daily Text always on (DONE)
Mike: "I want this to always have the day's text."
- Daily Text is a permanent shelf item. Add it automatically on load if it's missing, and hide Remove and Pause for it.
- It is always the **first** card in Today.
- If fetching fails (offline or reader down), show a placeholder card that says "Today's text couldn't load, tap to retry" with a link to the wol page, rather than leaving it out.

### v5: Watch tab (DONE, see section 3)
- Use the catalog API **`https://b.jw-cdn.org/apis/mediator/v1/categories/E/<key>?detailed=1&clientType=www`**. CORS is open, so the app fetches it directly with no reader. The response has `category.media[]` and/or `category.subcategories[]`, which you walk recursively. Each media item has `title`, `duration` (seconds), `firstPublished`, `images`, and `files[]` with `progressiveDownloadURL` plus `label` (240p/360p/480p/720p). Pick 480p or 720p. MP4s play in `<video>` directly with no CORS needed. Share/open link: `https://www.jw.org/finder?lank=<languageAgnosticNaturalKey>&wtlocale=E`.
- Confirmed category keys: **`VODPgmEvtMorningWorship`** (Morning Worship, ~440 videos, ~10 min each) and **`StudioNewsReports`** (News & Announcements, 84, includes Governing Body Updates). Others are under `VODBible`, `VODIntExp` (Interviews & Experiences), `VODChildren`, `VODMusicVideos`, `VODStudio`, `VODProgramsEvents`, `VODOurOrganization`. Those four sampled categories held 1,371 videos, 484 of them under 3 minutes. List the real subcategory keys before hard-coding anything.
- **Mike picks the categories once** (video items on the shelf, or a category picker in Watch), with a **length limit per category** (Morning Worship mustn't be cut by a short-clip limit). The feed fills itself with unseen videos, and new uploads appear on their own. Mike can still paste a single jw.org video link.
- Full-screen vertical swipe feed like TikTok, autoplay (sound needs a first user tap: mobile autoplay policy). **Widescreen videos: blurred-fill background by default. Morning Worship is a headshot, so crop to fill.** Videos can be saved to stashes like cards. Track `seen` per video.
- Also check whether the **JW Pressroom social clips** (TikTok/Instagram) are posted anywhere on jw.org. Not found so far; the jw.org newsroom (https://www.jw.org/en/news/) is articles. If they're not on jw.org, the fallback (later) is the share button, or a button that opens the pressroom profile in the browser so Mike never needs the TikTok app.
- Respect the limit-the-scrolling idea: Watch counts toward the daily drop (see v6), and it isn't endless.

### Own e-books (was v5)
"Add from my files": pick an EPUB or TXT on the phone, parse it (EPUB = zip of XHTML; JSZip from cdnjs is fine), and put it on the shelf like a Gutenberg book. Kindle and Audible files are DRM-locked and won't load.

### Listening mode (drops idea replaced by v8 scrolling time)
- **Drops:** no endless scroll. Scheduled drops (e.g. morning, noon, evening), each 5 items mixing cards and videos. After that comes a closing screen, "That's it, next drop at noon," with a countdown and nothing else to scroll.
- **Listening / driving mode is the exception: unlimited.** One big Play button, then a **black screen** with the Screen Wake Lock API so audio keeps going. It reads cards aloud (speechSynthesis) and plays video audio (Morning Worship is ideal for Mike's 40-minute drive) and clips back to back, pulling continuously from the shelf. Rule: **limit the scrolling, not the listening.**

### Later
- **Share target:** share a page, a jw.org link or a TikTok/IG link into IdeaStash (manifest `share_target`). Public TikTok/IG posts can be saved as embeds. Neither platform allows reading Mike's feeds automatically, so don't try.
- **IdeaStash Studio:** a separate **PC tool**, not part of the phone app. Input a DRM-free audiobook (e.g. a Libro.fm MP3; Mike wants *The 7 Habits of Highly Effective People*) plus a cover image, as a **one-time batch per book**:
  1. Whisper transcript with word timestamps. Mike has a `whisper-env` folder and Ollama/LM Studio installed.
  2. AI picks self-contained 30–60 s passages that start and end on complete thoughts at natural pauses.
  3. Cut the audio.
  4. Render vertical captioned videos (audiogram / animated captions). Background: article images with slow pan/zoom if there are any, otherwise the blurred book cover with the sharp cover centered, otherwise a gradient.

  Mike reviews the batch and deletes duds, then it publishes to the Pages site and the phone app drips the clips out. It can optionally export files for manual posting or Buffer. Copyrighted audiobook clips are fine for personal use; posting them publicly risks takedowns.

## 7. Notes and gotchas
- jw.org content is © Watch Tower: personal study only, don't republish.
- jw.org's own guidance warns about fake social accounts. Official jw.org sources are the point of the app.
- Mike's PC: Windows. `C:\Users\inspe\source` holds his code. gh CLI is installed. He uses Chrome on an Android phone. Install the app with Chrome ⋮ → Add to Home screen from the github.io link (not from a local file, where install and fetching won't work).
- Test headless (Playwright) at phone size 390×800, and mock `r.jina.ai` with real page samples. After building, look at screenshots before handing anything to Mike.
