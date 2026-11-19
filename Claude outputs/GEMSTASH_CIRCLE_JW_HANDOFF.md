# GemStash Handoff — Circle Integrations & jw.org Terms Compliance

*Written 2026-11-17 for Claude Code. Nothing in the project has been changed yet. Read `HANDOFF.md` in the project before changing anything.*

## Purpose and current state

GemStash can take its friend features from the Circle concept. It can also become fully terms-friendly by moving from scraped article text to jw.org's own downloadable audio, video and image files. This handoff covers both, for Claude Code to pick up on Mike's PC.

- **GemStash today (v23):** a phone web app on GitHub Pages (`pauljlinenfelser-prog/ideastash`, project folder `C:\Users\inspe\source\IdeaStash`). It has one Today feed of cards and videos with a daily time limit, a Shelf of jw.org sources, hearts and gems, Listen with jw.org MP3s, auto-scroll and Share. Since v19 it also has a friends circle with comments on Firebase (`gemstash-10786`).
- **Circle (designed July 2026, never built):** a small spiritual social app. It had a 25-member cap, a mutual "I know this person" gate and private relationship tags. It also had two post types (Found Treasures and What's Happening), a weekly Together question and a Silver Sword look.
- **Mike's working rules still apply:**
  - One change at a time, each saved as its own version.
  - A full copy of each version goes in `versions/vN`, and `ROLLBACK.bat` must keep working.
  - Update the VERSIONS list in `README.txt` and bump the cache in `sw.js`.
  - Give Mike plain-language, click-by-click steps.

## Circle → GemStash integrations

The "I know this person" gate matters most. Today anyone with the 6-letter code joins instantly, so a forwarded invite could let a stranger in. The rest are listed best fit first.

| # | Feature from Circle | How it fits GemStash | Fit | Notes |
| --- | --- | --- | --- | --- |
| 1 | "I know this person" gate | Entering a code sends a join request; the owner (or any member) taps "Yes, I know them" to let them in | Strong | Closes a real gap. Needs a `requests` subcollection and updated Firestore rules |
| 2 | Private relationship tags | Tag members as Wife, Son, Friend, Congregation (with its name, e.g. "Clare Congregation"); only you see them, on the member list and next to comments | Strong | Saved on the phone only (localStorage). No server work. Easiest item |
| 3 | Found Treasures | "Share a gem into the circle" with your own note, shown in a Friends' gems list | Strong | Already sketched as the optional v21 idea in HANDOFF.md. Shares the jw.org link, never the content |
| 4 | 25-member cap | Keeps the circle intimate | Strong | Firestore rules can't count members, so check the count when approving a request (#1) or keep a member counter |
| 5 | Together weekly question | A "Gem of the week" the owner picks for everyone to comment on | Strong | Gives a reason to talk without adding a scrolling feed. Circle never decided between daily and weekly |
| 6 | Member face row | Initials in colored rings at the top of Friends; tap to open the member drawer | Simplified | Photo uploads would break the "no uploads" rule; people signed in with Google could show their Google photo |
| 7 | Gentle nudges | Replace with a "new from friends" badge on 💬 | Simplified | A reminder to post would work against GemStash's anti-scrolling goal |
| 8 | What's Happening posts | Personal life updates not tied to a gem | Mike's call | Pulls GemStash away from "strictly jw.org"; a text-only version is possible |
| 9 | Direct messages | Tap a member to message them | Mike's call | A bigger build; the phone's own messaging may already cover it |
| 10 | Silver Sword look | Optional theme | Low | GemStash already has its purple-and-gems look |

Circle already dropped a prayer board, WhatsApp integration and copying jw.org content. Those stay out of GemStash too.

## jw.org Terms of Use: where GemStash stands

GemStash's video, audio and sharing features fit the [jw.org Terms of Use](https://www.jw.org/en/terms-of-use/). Its article-text cards do not. This is a plain reading of the terms, not legal advice.

**What the terms allow**

- Viewing, downloading and printing for personal, non-commercial use.
- Sharing links to the site and to downloadable publications, videos and audio.
- Free, non-commercial tools that download electronic files (EPUB, PDF, MP3, MP4) from public areas of the site.

**What the terms forbid, and where GemStash runs into it**

| Terms rule | GemStash today | Status |
| --- | --- | --- |
| No tools made to collect, extract or scrape text or data from the site | QFR, Bible Questions Answered, the series and the Daily Text are fetched through r.jina.ai, and the text is pulled into cards | Conflicts (the biggest issue) |
| No access by methods other than those the site provides | Same reader-service fetches | Conflicts |
| No distributing site materials as part of a software app | jw.org text and picture sets are shown inside GemStash cards | Conflicts |
| Same scraping rule | The `sources.js` lists were built from jw.org index pages and sit on the public Pages site | Conflicts (minor) |
| No posting site materials online or distributing them | Friends see links and comments only, but article titles are stored on Firebase | Grey area |
| Free tools that download MP3/MP4 files are allowed | Videos and 🎧 audio play jw.org's own files through its media services | Fits |
| Sharing links is allowed | 📤 Share and 💬 comments pass along jw.org links and friends' own words | Fits |
| No commercial or marketing use | Free, no ads, no money | Fits |

## Suggestions to be fully terms-friendly

Build GemStash as an audio-and-video reader of jw.org's own download files, and send readers to jw.org for the text. 344 of the 371 list articles already have an official MP3 (found in v16).

1. **Audio-first cards.** Each card is an image, the narration MP3 and the article's short video where there is one. Get all three from jw.org's media service by document number (`GETPUBMEDIALINKS?docid=…`), which GemStash already calls for 🎧. Stop storing scraped article text.
2. **Stop using the reader service.** Retire the r.jina.ai fetches for jw.org and wol.jw.org pages, and the `upgradeCard` / `articleBlocks` text code that depends on them.
3. **Link-out cards.** The Daily Text and articles with no MP3 show the image, the title and "Open on jw.org" (or JW Library). The title is a link; no body text is copied.
4. **EPUB shelf for text.** For reading, use publications jw.org offers as EPUB or PDF downloads, such as magazines and books, through the v23 EPUB import. Mike downloads the file himself from jw.org.
5. **Leave JWPUB alone.** Some publications (e.g. *Was It Designed?*) are only offered as JWPUB, JW Library's locked format. Don't decode it.
6. **Friends share links and their own words only.** Keep comments keyed by the jw.org link. Consider dropping the stored article `title` from Firebase, or keep it short.
7. **Keep it free and personal.** No ads, no money, no public republishing. Say so in About.
8. **Rebuild `sources.js` from media data where possible**, so the lists come from services jw.org provides rather than scraped index pages. Open question: whether a document list can come from those services alone.
9. **When in doubt, ask jw.org.** The Legal Department contact on the terms page can give a definite answer.

### Worked example: the Remora layered card

[The Remora's Sucker](https://www.jw.org/en/bible-teachings/science/was-it-designed/remora-sucker/) (document 502200108) has everything the layered card needs, all from [jw.org's media listing](https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?docid=502200108&output=json&langwritten=E&txtCMSLang=E):

| Piece | Format | Length | Size | Role on the card |
| --- | --- | --- | --- | --- |
| Narration | MP3 (`502200108_E_cnt_01.mp3`) | 2 min 12 s | 1.2 MB | Full volume underneath, with a progress bar; the card ends when it ends |
| Video | MP4, 240p–720p (`502200108_E_cnt_2_r480P.mp4`, etc.) | 22.5 s | 1.7–5.5 MB | Below the image, looping at about 10–15% volume or muted |
| Image | JPG (`cms-imgp.jw-cdn.org/img/p/502200108/univ/art/502200108_univ_sqr_xl.jpg`) | — | — | Fills the top of the screen |

One tap starts the card, because phones only allow sound after a tap. Auto-scroll waits for the narration to finish. The whole *Was It Designed?* publication is offered only as a 17.1 MB JWPUB ([listing](https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?pub=ijwwd&output=json&langwritten=E&txtCMSLang=E)), so its text stays on jw.org.

## Proposed version order

Do the terms work first, so friends never pass around copied content, then the Circle features. One version each, starting after v23.

1. Layered audio + video + image card for *Was It Designed?* articles (the Remora layout).
2. Audio-first cards for the other list sources; stop storing scraped text.
3. Link-out cards for the Daily Text and articles with no MP3.
4. Retire the r.jina.ai reader for jw.org pages, and rebuild `sources.js` from media data where possible.
5. "I know this person" join requests with owner approval.
6. 25-member cap, enforced at approval.
7. Private relationship tags (phone only).
8. Share a gem into the circle, plus the Friends' gems list.
9. Gem of the week.
10. Member face row and the "new from friends" badge.

## Open questions for Mike

- [ ] Does every article's image follow the `<docid>_univ_sqr_xl.jpg` pattern? The cards need a fallback if not.
- [ ] Keep any text on cards at all, or go fully audio, video and link-out?
- [ ] What's Happening posts and direct messages: in or out?
- [ ] Weekly or daily for the Gem of the week?
- [ ] Contact jw.org's Legal Department for a definite answer before sharing GemStash with friends?
