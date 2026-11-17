GemStash (formerly IdeaStash) — your own free Deepstash (current: v14)
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
  Watch (v5) jw.org videos in a full-screen swipe feed. Swipe up for the next video; tap for
              sound; tap again to pause. 🔖 saves to a stash, 🔗 opens it on jw.org.
              ⚙️ Channels: pick which jw.org video channels come in, how many a day, and a length
              limit. Starts with Morning Worship, Truth Transforms Lives and Apply Bible Principles.
              Morning Worship always comes in; besides it only ONE video over 5 minutes a day.
              ＋ Link: paste a jw.org / JW Library video share link to watch it here.
              Not endless: after today's videos it says "That's today's videos".
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
  v5  📺 Watch tab — jw.org videos, swipe feed like TikTok (limited to today's set), channel
      picker with per-day count and length limit, paste a video link, save videos to stashes.
  v6  ❤️ Hearts, TikTok style: double-tap any card or video (or tap 🤍) to save it to
      Favorites with a big heart pop. Tap ❤️ again to un-heart. 🔖 still picks other stashes.
  v7  New home-screen icon: a lit oil lamp (Psalm 119:105). Name stays IdeaStash.
      Drawing kept in art\icon-lamp.svg. To see it: remove the app from your home screen
      and add it again from Chrome (your saved cards stay).
  v8  ONE feed: videos are now in Today. Order: Daily Text, Morning Worship, a 2nd video,
      Questions From Readers, a video, Bible Questions Answered, then more cards and short
      videos mixed. No more 5-card limit: More > "Daily scrolling time" (5/10/20/30/60 min or
      None, default 20). When it's up, Today ends with "That's your time for today" (a video
      you're watching isn't cut off). Watch tab removed: Video channels are on the Shelf tab,
      video links in Add > Video link.
  v9  More from jw.org, all on the Shelf from the start (1 a day each, remove any you like):
      🦉 Was It Designed? (48 - articles with a photo, or short videos that play full screen)
      📜 Bible Verses Explained (55)   🏡 Help for the Family (42)
      🏛️ From Our Archives - our history (35)
      🖼️ Become Jehovah's Friend posters (8) - full-screen pictures, 🔍 opens full size.
      Video channels also turned on: Blessings of Sacred Service, Enduring Trials, History.
  v10 🎨 Illustrated Bible Stories (22) on the Shelf: each story is a picture set you swipe
      SIDEWAYS through (cover + 3-5 comic pages), with dots and a "2 / 5" counter. Swipe up
      for the next item. 🔍 opens the page you're on full size (pinch to zoom).
  v11 Whole articles: cards from jw.org now keep the headings, highlighted questions, numbered
      points and bullets, and read to the end of the article (scroll inside the card). Each one
      ends with "Read the full article on jw.org". Cards made earlier fetch the full article
      the first time they come on screen. The photo now scrolls away with the text.
  v12 No more repeated videos. jw.org posts some talks more than once (Morning Worship
      "John Ekrann: We All Stumble Many Times" is also in Apply Bible Principles; some have
      "-Excerpt" copies). IdeaStash now compares the talk itself, keeps one per day, and won't
      bring back another version of a talk you've already watched.
  v13 New name: GemStash. And the Daily Text (and every article) is shown in FULL: the card is
      as long as its text and you scroll straight through it, buttons stay at the bottom, then
      the next swipe goes to the next item. (Before, the end was hidden in a small box.)
      Bookmarks are now gems: 💎 saves to a stash (faded until saved, bright once saved),
      and the Stashes tab is a 💎. The web address and your saved data stay the same.
  v14 New home-screen icon: a collection of gems (diamond, ruby, sapphire, emerald). Drawing in
      art\icon-gems.svg (the old lamp is kept as art\icon-lamp.svg). To see it: remove the app
      from your home screen and add it again from Chrome (your saved cards stay).
  Next: Listening (driving) mode
