IdeaStash — your own free Deepstash (current: v4)
=======================================

FOLDERS
  CLAUDE.md   project notes + roadmap for Claude Code
  app\        the live app (index.html, sw.js, manifest.json, icons)
  versions\   a full copy of every delivered version (v1, v2, ...)
  ROLLBACK.bat  restore any saved version into app\
  DEPLOY.bat    publish the project to GitHub Pages so it runs on your phone

GET IT ON YOUR PHONE (one time, ~5 minutes)
  1. The project lives in C:\Users\inspe\source\IdeaStash (open this folder in Claude Code)
  2. Run "gh auth status" — make sure you're signed in to the GitHub account you want
     (gh auth switch to change between ALSON-RDLABS and your personal one).
  3. Double-click DEPLOY.bat. It prints your link: https://<you>.github.io/ideastash/
  4. Open that link in Chrome on your phone → menu ⋮ → "Add to Home screen" / "Install app".

WHAT IT DOES
  Today tab   5 fresh idea cards each day, scroll-snap like Deepstash, then endless "explore".
              Finishing the 5 grows your 🔥 streak.
  Shelf (v2)  the sources YOU pick. Every morning, new ideas from each one land in Today:
                📅 Daily Text (always on, always the first card in Today)
                ❓ Questions From Readers (on from the start) — all 553 from the Watchtower Index
                📘 Bible Questions Answered (on from the start) — 191 questions from jw.org
                📖 Any Gutenberg book you add (2 passages a day by default)
              Tap a shelf item to set ideas-per-day, In order / Random (never repeats),
              pause, start over, or remove. Progress bars show how far through you are.
  Stashes     group ideas into collections; search everything.
  Add
    Books        search Project Gutenberg → tap a book → "Add to My Shelf" or
                 "Pick passages now" (25 passages to choose from).
    Web/jw.org   "Today's Daily Text" one tap, or paste any jw.org / wol.jw.org / article link.
    Paste        paste notes or text; each paragraph becomes a card.
    Write one    type your own idea.
  More        export/import a .json backup (your ideas live on the phone only).

HOW IT READS WEBSITES
  Websites like jw.org don't let other apps read them directly from a browser, so pages
  go through r.jina.ai, a free public "reader" service. No key needed. If it's ever slow
  or down, Paste always works.
  jw.org content is copyrighted by Watch Tower — fine for your personal study, don't
  republish the cards publicly.

Opening index.html straight off your PC works for testing, but book/jw.org import and
install-to-phone need it hosted (DEPLOY.bat).

VERSIONS
  v1  Today feed, stashes, Add (books, jw.org links, paste, write), backup
  v2  My Shelf — daily auto-delivery from books, Daily Text, Questions From Readers,
      Bible Questions Answered. Also fixes Gutenberg license text slipping into cards.
  v3  Daily Text always on — it's on the shelf for good (no Pause/Remove), always the
      first card in Today, and if it can't load you get a "tap to retry" card instead.
  v4  🔊 Listen button on every card (reads it aloud; tap again to stop; Bible references
      read as "Proverbs 16, verse 3"). Questions From Readers and Bible Questions Answered
      are on the shelf from the start (remove them if you like - they won't come back).
      Fixes Bible Questions Answered titles that showed jw.org's menu path.
  Next: v5 Watch — jw.org video categories (Morning Worship, News, Bible, Interviews…)
