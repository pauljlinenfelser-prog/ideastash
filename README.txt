GemStash (formerly IdeaStash) — your own free Deepstash (current: v50)
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

BETA (test copy): https://pauljlinenfelser-prog.github.io/ideastash/beta/
  A separate copy for trying changes before they reach the real app. It has its own name
  (GemStash Beta), its own storage and its own offline cache, so it never touches the real app's
  hearts, stashes or streak. Experiments are switched on in More -> Beta experiments.
  Beta 1 (2026-11-17): layered card for Was It Designed? - picture + jw.org narration + short
  video, built only from jw.org's own media files (no page reading). Toggle: Show the Remora example.
  Beta 2 (2026-11-17): new layout - top third the jw.org Was It Designed? art (nautilus),
  middle the article's short video (silent, loops until the narration ends), bottom the article
  picture with title + progress. Fixed: the narration no longer stops when the video ends.
  Beta 3: the top third is the Was It Designed? title card (drafting desk + logo), shown from
  jw.org's own video paused at 0:04 - nothing copied. Nautilus art stays as the fallback.
  Beta 4: the narration no longer stops when the screen changes size for a moment (address bar
  sliding, rotating); it only stops when you really move on. The feed re-centers after a resize.
  Beta 5: Was It Designed? sorted by what jw.org offers - 17 full videos play full screen,
  19 narration-only articles get an audio card (title card + the article's picture, or the
  nautilus art), 11 narration+clip keep the composite card, 1 with nothing is skipped.
  Beta 6: fixed narration-only cards (like A Mother's Milk) switching to an empty middle band
  after loading; they keep the title card + picture layout.
  Beta 7: all 19 narration-only articles use title card (top third) + picture (bottom two-thirds);
  the card tries jw.org's square, wide and tall pictures; only the Pomelo has none (nautilus art).
  Beta 9: no more article text taken from jw.org. Questions From Readers, Bible Questions
  Answered, Bible Verses Explained, Help for the Family and From Our Archives are now listen
  cards like Was It Designed?: series picture on top, the article's picture and title below,
  and jw.org's own narration (title from jw.org's audio service). Articles jw.org hasn't
  narrated (most older Questions From Readers) show the picture and title with a big
  "Read on jw.org" button. Old text cards turn into listen cards, keeping hearts and gems.
  Today's Daily Text is still read the old way until the Daily Text download is added.
  Beta 10: narrated articles only (Mike's call). Articles jw.org hasn't narrated are skipped
  when the shelf delivers, and any Read-on-jw.org cards stay out of Today (still in your gems).
  Beta 11: the beta has its own icon - the gems with a pink B (art/icon-gems-beta.svg).
  Beta 12: the Daily Text comes from jw.org's own download of Examining the Scriptures Daily
  (an EPUB file, once a year). Today shows an "Add this year's Daily Text" card with
  1. Download it from jw.org, 2. Pick the downloaded file. After that, each day's text comes
  from the file on the phone; nothing is read from jw.org's pages. Picking the file with
  Add a book works too. In January the card asks for the new year's file.
  Beta 13: the beta's number shows in More (Beta experiments heading and About).
  Beta 14: the Daily Text card links to the jw.org EPUB it came from (source line + a
  "Taken from jw.org's download" link), so it's plain the text isn't taken from jw.org's pages.
  Beta 15: More > About has "How does GemStash work?": a short FAQ on where everything comes
  from and how that fits jw.org's Terms of Use (personal, free, jw.org's own files, links back).
  Beta 16: each listen card says "from jw.org's MP3 download" and links to that MP3 (its sound,
  title and the picture packed inside it). The FAQ says so too. Series banners stay for now.
  Beta 17: More > Beta experiments lists what each beta added (newest first, older ones folded
  under Earlier betas), and which ones are now in the app. Each new beta adds its line there.
  Beta 17: More > Beta experiments lists what each beta added (newest first, older ones folded
  under Earlier betas), and which ones are now in the app. Each new beta adds its line there.
  Beta 18: the stuck-feed fix from app v40 (extra listen/picture cards no longer stop Today).
  Beta 19: What's new marks Betas 12, 14, 15 and 16 as now in the app (v41-v43).
  Beta 20: Add no longer has paste a jw.org link (same as app v50).
  Beta 21: the beta is rebuilt from today's app (v50) plus its own bits: separate storage, the pink-B
  icon, its number and the What's new list. It now has everything the app has. The old beta is kept in
  versions/beta20. From now on, a new beta starts from the current app (scratchpad beta21.py shows how).
  Beta 22: new circles (Mike's design): a personal code each, requests you accept, your own circle size
  (5 to 50), your own photos and videos (up to 1 minute) in Today and on a new Circle tab, a switch for what
  Today shows and one per person. Needs the new Firebase rules published, and Firebase Storage switched on
  (pay-as-you-go) for photos and videos.
  Beta 23: sharing gives up after ~30 s with a clear message when Firebase Storage is off.
  Beta 24: free photo sharing: a photo is shrunk on the phone (about 0.5 MB) and kept in Firebase's free
  database, so no paid storage is needed. Videos wait until Mike switches on Storage (CIRCLE_VIDEOS).
  Beta 25: things you finish rest before coming back in Today (a card read and swiped past after 6 s, a
  narration or series video played to the end); 1 month by default, set in More. Hearted/stashed never rest.
  Beta 26: "Photos from your circle" on the Shelf: whose photos mix into Today, how many a day (1-10), and
  how spread out (every other / 3rd / 5th / 8th slide). Always all on the Circle tab.
  Beta 27: hearted/saved things stay out of Today for good (each stash has a "Replay in Today" switch);
  Stashes show as a picture grid like TikTok's saved list.
  Beta 28: rest time in months (1-12) or Auto (jw.org cards on the shelf / cards a day), set in More.
  Beta 29: the phone's read-aloud voice waits 0.35 s and says a quiet pause first, so it no longer misses
  the opening words.
  Beta 30: cards opened from Stashes (e.g. All ideas) play again; closing the card stops the sound.
  Beta 31: the ➕ Add tab now shares your own photos with your circle (postSheet; sets up the circle
  first if needed). Adding a book or a jw.org video link moved to the bottom of the Shelf.
  Beta 32: Stashes becomes Treasures (closed treasure-chest icon): Hearted, Gems, Recently finished and a
  pouch per tag. 💎 saves in one tap with an optional tag strip (tap 💎 again to skip). Old stashes became tags.
  Beta 33: profile pictures: tap your name on the Circle tab. Kept free in Firestore photos/av_<uid>, seen
  only by your circle; shown on the Circle tab, on circle photos and on comments.
  Beta 34: profile pictures fit their circle (the inline colour had reset the picture size: zoomed corner).
  Beta 35: invite links (Circle tab 📤 Share): .../beta/?join=CODE opens GemStash on the Circle tab with
  "X invited you"; name + Join sends the request automatically (also for people who already have it).
  Beta 36: optional parental controls: a parent's PIN (More, or offered when first setting up the circle)
  locks the Circle tab, sharing, comments and circle settings; circle photos in Today hidden or look-only.
  Beta 37: parental controls also lock the daily scrolling-time setting.
  Beta 38: beta icon = the app's treasure chest with a pink B (icon-chest-b-*.png; the old gems icon
  files icon-192/512.png are kept, no longer used).
  Beta 39: the B moved to the top-right of the beta icon (Edge's "e" covers the bottom-right): icon-chest-bt-*.png.
  Beta 40: share several photos at once (up to 10): they go to your circle as ONE set you swipe through sideways
  ("1 / 4" counter), in Today and on the Circle tab. Add more or take some out before sharing. No rules change.
  Beta 41: shared photos moved from the Circle tab to Treasures ("My treasures" = yours, "From my circle" =
  everyone else's); the Circle tab is just people and settings.
  Beta 42: 🔔 alerts at the top: someone joins or asks to join, shares photos, comments on your photos
  (and new messages). Kept on the phone (db.alerts); new photos are checked every 5 minutes.
  Beta 43: messages: one-to-one chats (text and photos) with people in your circle, on the Circle tab under
  💬 Messages (or ⋯ → Message). Firestore chats/{a_b} + /m; rules published 2026-11-18 9:12 PM. Parent's PIN
  locks them.
  Beta 44: narrated articles with several pictures on jw.org show them as a swipeable set that moves along
  with the narration (jw.org's numbered pictures, img/p/<doc>/univ/art/<doc>_univ_cnt_<n>_xl|lg.jpg).
  Beta 45: how-to videos (video/howto/GemStash-1..7-*.mp4, made from the beta with the pitch music, each ending
  on "Turn your doom scrolling into LIFEscrolling"): More > 🎬 How-to videos, and at the top of the FAQ.
  Beta 46: sync between your devices. More > "Sign in with Google and sync" on the phone, then on the PC
  (same Google account). Hearts, gems, tags, shelf progress, finished/seen, settings, streak and scrolling time
  stay the same on both. Syncs only when you sign in, open GemStash, come back to it, or leave it (Mike asked:
  not every second). Stays per device: Daily Text EPUB, PDF/EPUB books, Today's lineup, parent's PIN.
  Firestore syncb/{uid}/p/{part}; needs the new block in firestore.rules published.
  Beta 47: sync fixes. More shows which Google account sync uses, "Use a different Google account" switches it,
  and Google always shows its account chooser. Mike's PC had signed in with a different Google account than his
  phone, so they synced into two separate spaces. Also: if the PC signs in first, the phone (with the circle) now
  keeps its circle and the Google sign-in moves to it; the PC then asks to sign in again.
  Beta 48: "Sign out of Google" in More (under Sync): sync stops there, the device leaves the circle until you
  sign in again; nothing is deleted.
  Beta 49: your own profile picture shows on your other device too (fetched from photos/av_<uid>).
  Beta 50: Shelf sync fixed: sources are matched by what they are (Daily Text, QFR, Bible, a book's link), not by
  each device's own random id, so settings and progress carry over; doubled sources on the PC are tidied (the
  phone's copy is kept). On a device's first sync, what's already in the cloud wins.
  Beta 51: auto-scroll no longer sticks on a narrated article whose narration ended without the player noticing
  (bar stops short) or that couldn't play; uses jw.org's own length for the narration.
  Beta 52: More > Auto-scroll: reading speed (Slow 150 / Normal 200 / Fast 280 words a minute, also sets how long
  pictures stay), pause between items (None / Short 1.5 s / Longer 4 s), narrated articles Whole or move on after
  1, 2 or 5 min (Bible chapters always whole). Synced between devices.
  Beta 53: 🔊 at the top of Today opens a volume slider for narrations, videos and the reading voice (kept on
  each device, not synced). Top bar stays on one line on phones (Bible shows as 📖 on narrow screens).
  Beta 54: Watch videos: slide along the bar at the bottom to move back or forward (time bubble), or tap a spot.
  Beta 55: auto-scroll moves on after a video that stopped in its last seconds or sits paused at the end, even
  when the phone never says it ended; the problem report notes what each video did.
  Beta 56: Illustrated Bible Stories come from jw.org's own PDFs, saved on the phone once (Shelf > Illustrated
  Bible Stories > Download all, then Add them). No story pictures are taken from jw.org's website any more.
  Beta 57: Daily Text on iPhone/iPad: picker accepts any file there (the EPUB filter can grey it out), the card
  says to tap Download (not Open in Books) and pick from Files > Downloads; plain messages for a wrong or
  incomplete file; the problem report notes each Daily Text step.
  Beta 58: narrated articles show their one main picture again; the extra pictures that slid along (Beta 44)
  are gone, because GemStash gathered them from jw.org's website (jw.org's Terms don't allow that).
  Beta 59: Mike's own series banners (beta/banners/, originals in art/banners-original/) replace jw.org's
  website banners on Questions From Readers, Bible Questions Answered, Bible Verses Explained, Help for the
  Family, From Our Archives and Listen to the Bible.
  Beta 60: Bible Character Cards have their own Shelf entry (🃏), apart from Children's Activities, so each
  can be paused on its own.
  Beta 61: back to the top of Today: tap Today again while in Today, or the Top button (shows from the 3rd card).
  Beta 62: Refresh Today at the top of the Shelf (retries what didn't load, drops cards from paused entries,
  starts from the first card). Paused Shelf entries' cards now stay out of Today.
  Beta 63: tap a text card (the Daily Text and other text cards) to hear it, tap again to stop; a double-tap
  still hearts it. A big play/pause sign flashes on the card.
  Beta 64: the reading voice no longer says "comma comma comma" first; a moment of silence wakes the speaker.
  Beta 65: TikTok-style side buttons on every card: heart, comments, save, share, and ... for the rest (full size,
  print, open on jw.org, read aloud, delete). Text cards too (no more bottom row). Videos: small full-screen icon top-right.
  Beta 66: pull down at the top of Today to refresh it (same as Refresh Today).
  Beta 67: bottom bar = Circle, the GemStash chest (Treasures), Add. Shelf, Refresh Today and Settings are in each card's
  ... menu (Shelf and Settings also at the top of Treasures). Back to Today: <- Today, the phone's back gesture, or the chest again.
  Beta 68: Bible chapter always 3rd in Today; on the card < and > for the previous/next chapter, tap the name to pick a
  book and chapter (also Bible reading in Treasures); the reading carries on from the picked chapter.
  Beta 69: top bar = BETA, alerts, streak in the middle, small Auto on the right; it fades while scrolling or playing
  and comes back on a touch. Volume slider in Settings. A tap during auto-scroll stops it and asks "Continue auto-scroll?".
  Beta 70: slide along the bar of a narrated article or Bible chapter to move back or forward; a tap jumps there.
  Beta 71: Bible picker shows progress: chapters heard to the end green, books started blue (with a count), finished green.
  Beta 72: mark Bible chapters as already read (one at a time, everything up to a chapter, or a whole book).
  Beta 73: Bible Character Cards come from jw.org's own PDFs, saved on the phone once (Shelf > Bible Character Cards >
  Download all, then Add them); front and back from the card in the PDF. Also fixed: PDF cards were seen as repeats.
  Beta 74: Bible Character Cards without jw.org's dashed cut-out line (cards already added are trimmed once).
  Beta 75: Shelf > Bible Character Cards / Illustrated Bible Stories lists what's missing on this phone (each with a
  Download button) and "See all" shows everything that's on the phone.
  Beta 76: the 13 older Bible Character Cards (2012, wide PDF page) are cut out right; ones added before need adding again.
  Beta 77: tap a card or story in "See all" to open it (Back to the list returns).
  Beta 78: who sees my own photos: whole circle, some people, or just me (change it later with ⋯ → Who sees this).
  Beta 79: share videos (up to 1 minute) with your circle, some people, or just you.
  Beta 80: edit your own comments (Edit next to Delete); edited ones say "edited".
  Beta 81: edit the words on your own photo or video post (⋯ → ✏️ Edit what it says).
  Beta 82: on your own post you can Remove anyone's comment.
  Beta 83: My treasures says "Loading your treasures…" while they come in, instead of looking empty.
  Beta 84: trim a video before sharing it (slide the two ends; up to 1 minute is kept, so longer videos work too).
  Beta 85: add background music from your phone to a video, with a Video/Music balance slider.
  Beta 86: Today stops repeating: choose how many videos over 5 min a day (1, 3 or no limit; was always 1), new cards from your Shelf sources past today's set, and no card you saw this week comes back.
  Beta 87: Focus. Gem Miner sends a topic bundle here (Start the focus). While it's on, GemStash opens with the theme
      (Mike's loupe miner, the verse, today's plan) once a day; Today brings the Daily Text, Bible reading, a featured
      Morning Worship from the bundle and 3 gems a day instead of the usual mix. Shelf → Focus: gems a day, long videos
      (no limit / up to 30 / up to 60 min), see the list, switch off, end. It ends by itself when every gem is given.
  Beta 88: Focus brings a Bible chapter from your topic: the gems' titles and the theme verse name verses, and each day
      the most-named chapter you haven't heard yet comes 3rd in Today (e.g. Courage: Joshua 1). Shelf → Focus → Bible
      reading: Theme chapter + my reading (the start), Theme chapter instead, or My reading only.
  Beta 89: Full focus (now the start): every gem in the bundle is in Today and only this topic (plus Daily Text and
      Bible reading); gems you don't get to come back the next day. "All shares from my circle (during full focus)"
      lets your circle's posts in. "Spread this meditation out": 1 to 10 gems a day (was 1 to 6).
  Beta 90: Full focus has no daily scrolling limit (unless a parent set it with a PIN).
  Beta 91: the Gem Miner cart on the Shelf keeps every list sent from Gem Miner; pick one to focus on it again any day.
  Beta 92: Focus in the bottom bar (Mike's loupe miner, next to Treasures): your focus and Gem Miner cart in one place; it glows while a focus is on.
  Beta 93: Circle has Mike's own picture (miners around a lantern) in the bottom bar, Shelf and Treasures; Circle and Focus pictures sit up beside the chest.
  Beta 94: Auto-scroll has Mike's rolling gem cart (mirrored); it rolls while auto-scroll runs, and the button says Stop.
  Beta 95: the streak is Mike's brass lantern: a small flame (0-6 days), a steady glow (7-29), a blaze (30+).
  Beta 96: Mike's brass bell for alerts (it swings when something new is waiting) and his pickaxe with a green gem for Add.
  Beta 97: at the end of a focus list, a screen asks: Go through it again, Pick another list, or Back to my usual mix.
  Beta 98: Focus → Other gems: None (nothing else, not even your circle or your own posts) or a short break after every
      3rd … 10th focus gem (circle shares first, then gems you've kept). Replaces "All shares from my circle".
  Beta 99: GemStash's opening screen once a day (purple): Mike's video of the miner picking at the ore, finding a gem and examining it
      (black background removed, fading in), then "Turn your
      doom-scrolling into LIFE-scrolling" and Proverbs 2:4, 5. Also: switching lists on the same day shows only the new list.
  Beta 100: Circle has Mike's new picture: three miners (grandfather, boy and mother) sharing a blue gem.
  Beta 101: the opening screen plays every time GemStash is opened fresh (was once a day); switching back from another app doesn't replay it.
  To drop the beta: just stop using the link (or delete the beta folder). The real app is unaffected.

GEM MINER (companion app, its own link: https://pauljlinenfelser-prog.github.io/ideastash/gemminer/)
  Gathers jw.org videos and narrated articles on one topic into a bundle, and sends it to GemStash
  for a focused meditation. Lives in the gemminer folder. Icon: Mike's gem cart.
  Gem Miner Beta 1: starter packs (Courage, Prayer, Family, Anxiety & peace, Faith in hard times,
      Kindness, Hope, Love for Jehovah), topic or verse search (e.g. anxiety, Josh 1:9), the bundle
      (a featured Morning Worship first, ✓ to keep, ＋ to add more finds, a theme verse), Your bundles,
      and Send to GemStash (opens GemStash Beta with the bundle in the link; GemStash learns to use
      it in its Focus update, which comes next).

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
  v15 Fix: some Bible Questions Answered cards showed jw.org's video-player menus (Settings,
      "This is a modal window", Speed 2x...0.6x, Cast, AirPlay) instead of the answer. Those
      are now skipped, and a card that already caught them re-reads the page the next time
      it comes on screen.
  v16 Real jw.org readers: cards with a recording on jw.org show 🎧 instead of 🔊 and play
      jw.org's own reading (344 of 371 articles: all Bible Questions Answered and Bible
      Verses Explained, most Help for the Family, From Our Archives, Was It Designed?).
      The Daily Text and Questions From Readers have no recording, so they keep the phone voice.
  v17 📤 Share: opens your phone's share menu (Messages, WhatsApp, email...) with the direct
      jw.org link - videos use jw.org's own share link, articles/posters/stories their jw.org
      page, the Daily Text its wol.jw.org page. On cards it replaces Copy; on videos it replaces 🔗.
  v18 ▶ Auto button (top right of Today): hands-off scrolling. Text cards glide down at reading
      pace then move on, videos play to the end, posters stay ~8 s, picture stories turn their
      pages. Touch the screen to pause it for a few seconds. Remembers on/off. Time limit still applies.
  v19 Friends & 💬 comments. More -> Friends: Sign in with Google (recommended), type your name,
      Start a circle, then 📤 Invite a friend (sends the app link + your 6-letter code). Friends join
      with the code. Every gem gets 💬 with a count: read and add comments with your circle.
      Delete your own; the circle's starter can delete any comment and remove members.
      Uses the free Firebase project gemstash-10786 (Mike's Google account); rules in firestore.rules.
  v20 No ✏️ edit button: GemStash shows jw.org's own words, unchanged.
  v21 jw.org only. Add has just "jw.org link" (a pasted jw.org / wol.jw.org link becomes one
      complete gem, with 🎧 when jw.org has a recording) and "Video link". Other websites are
      turned away. No more Gutenberg books, Paste or Write one, and no starter guide cards.
      Nothing you saved was deleted; old book/self-made cards just stay out of Today.
  v22 The phone's voice (🔊) skips what's in parentheses, like "(Luke 12:29-31)", and the closing
      Watchtower reference, like "w25.03 28-29 ¶10-11". jw.org's own 🎧 recordings are unchanged.
  v23 Books are back: Add -> 📖 Books has "📄 Add a book from my files (PDF or EPUB)" and the free
      Gutenberg search; the Shelf has "A book" again. Your file is read on the phone and kept there
      (nothing uploaded), then delivered 2 passages a day like any book. Kindle/Audible are
      copy-locked and won't open; scanned PDFs (pictures of pages) have no text to read.
  v24 Was It Designed? from the beta: 17 full videos play full screen; 19 narration-only get the
      title card + picture card; 11 narration+clip get the composite card; all from jw.org's own
      media files (no page reading). Older text cards switch to the new style once.
  v25 Updates show up right away: the app always checks GitHub for the newest copy (before, the
      phone could keep using an old copy for up to 10 minutes after a release). Beta too.
  v26 No article text copied from jw.org: Questions From Readers, Bible Questions Answered, Bible
      Verses Explained, Help for the Family and From Our Archives are listen cards (series picture,
      the article's picture and jw.org's title, jw.org's own narration). Only narrated articles are
      used. Old text cards turn into listen cards, keeping hearts and gems. Also fixes Was It
      Designed? cards after the first one being skipped.
  v27 Full screen for videos: a new button on every video (below share) fills the screen turned
      sideways; turning the phone sideways while a video is on screen does it too. Tap the X or
      Back to return to the feed; it also returns by itself when the video ends.
  v28 Morning Worship is no longer zoomed in: you see the whole picture (use full screen for big).
  v29 Full screen fix: going full screen (or turning the phone) no longer starts the next video
      behind the one you're watching; coming back lands on the same video.
  v30 New video channel: A Day in the Life of... (jw.org's series: Bethel commuter, need-greater,
      translator), on by default, one a day; also listed under Our Organization in Watch.
  v31 New video channel: Convention Videos (short) - the short videos and excerpts from every
      convention 2019-2026 (171 of 10 minutes or less; invitations and trailers left out), on by
      default, one a day.
  v32 Many more jw.org video series to choose from in Watch > Channels (all off until you turn them
      on): Series (Reasons for Faith, Walk Courageously With God, Lessons From The Watchtower, Learn
      From Them, Imitate Their Faith, Love People, Enjoy Life Forever, Dig for Treasures, Our History in
      Motion, Organizational Accomplishments, For a Happy Marriage), Teenagers, Family, Our Activities,
      Dramas, The Bible Changes Lives, Viewpoints on the Origin of Life, Learn From Jehovah's Friends.
  v33 Children's Activities on the shelf: one jw.org printable a day (30 Bible Character Cards,
      30 Picture Activities), shown as a picture with a 🖨️ button that opens jw.org's PDF to print.
  v34 A music video a day: jw.org's Original Songs channel is now on (newest first, up to 10 min).
      Turn it off in Watch > Channels if you'd rather not.
  v35 Listen to the Bible: a new shelf item that plays jw.org's own audio recording of the New World
      Translation, one chapter a day in order, Genesis 1 to Revelation 22 (1,189 chapters). Change it
      to 2 or 3 a day, or Start over, on the Shelf tab.
  v36 Pick up where you left off: open GemStash again the same day and Today goes back to the card or
      video you were on (and how far down a long card you were), not to the top. A new day starts at the top.
  v37 Bible Character Cards you can swipe: each card shows its front (picture and questions), then
      swipe sideways for the back (profile, map, timeline and answers), like the Illustrated Bible Stories.
      It's jw.org's own picture of the same card that's in the PDF; the 🖨️ PDF link stays.
  v38 Was It Designed? uses only the title card from 0:04 of jw.org's video (Mike's pick); the nautilus
      website banner is gone. The one article with no picture (the Pomelo) shows the title card there too.
  v39 Problem report: GemStash keeps a short note of what the feed does (kept only on the phone). When
      something goes wrong, More > Something not working? > Copy a problem report, then paste it to Claude.
  v40 Fixed: Today got stuck after many cards. When an extra card at the end was a listen card or a
      picture card, it was set up as a video, which failed, so the feed couldn't move past it. Now every
      extra card works, and when there's truly nothing left a "You've seen everything for now" card says so.
  v41 Daily Text from jw.org's download (from Beta 12 and 14): once a year, download jw.org's Examining
      the Scriptures Daily (EPUB) and pick it in GemStash; each day's text then comes from that file on the
      phone, and the card links to jw.org's EPUB. Nothing is read from jw.org's pages for it any more.
  v42 "How does GemStash work?" (from Beta 15): More > About has a short FAQ on where everything comes
      from and how that fits jw.org's Terms of Use.
  v43 Each listen card says "🎧 from jw.org's MP3 download" and links to that MP3, the file its sound,
      title and picture come from (from Beta 16). The FAQ says so too. Everything from the beta is now in the app.
  v44 Straight to the Bible reading: press and hold the GemStash icon on the home screen and tap
      "Bible reading" (or drag it out as its own icon). GemStash opens on today's Listen to the Bible
      chapter, even when the day's time is used up; tap ▶ to listen.
  v45 The Bible reading shortcut uses the 📖 open-book picture Mike liked (Google's free Noto emoji, the
      same one Android shows).
  v46 The Shelf tab's icon is now 📚 (books), so 📖 means the Bible reading.
  v47 A 📖 Bible button at the top of Today (next to Auto) jumps straight to today's Listen to the Bible
      chapter. (Mike's phone doesn't show the home-screen icon menu from v44.)
  v48 New look: Mike's treasure chest of gems (with G S on the front) is the app icon, and a small copy
      sits in the top-left corner of the app instead of the word GemStash.
  v49 The Bible reading remembers where you left off: stop or close mid-chapter and ▶ carries on from
      there (a few seconds back), even days later. A chapter stays as your Bible card until you've heard it
      to the end, and then a "Next chapter ▶" button lets you go straight on. Other listen cards remember
      their spot too.
  v50 The Add tab no longer has "paste a jw.org link" (it read the article page, the last thing that
      didn't fit jw.org's Terms). Add now has Books and Video link. (The beta too, Beta 20.)
  Next: ask Mike
