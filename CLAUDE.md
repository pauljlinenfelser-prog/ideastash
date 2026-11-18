# GemStash (formerly IdeaStash): Claude Code notes

**Read `HANDOFF.md` first.** It has the full project history, how the code works, current status and the agreed roadmap.

## Mike's rules (always)
- Mike doesn't code by hand. Explain in plain language and give exact steps.
- ONE change at a time. Each change is a new version, with a full copy of `app/` in `versions/vN/`. `ROLLBACK.bat` restores any version.
- Each release: update README.txt VERSIONS, bump `CACHE` in `app/sw.js`, then deploy with `DEPLOY.bat`.
- GitHub: Mike's personal account `pauljlinenfelser-prog` (not ALSON-RDLABS). Phone link: https://pauljlinenfelser-prog.github.io/ideastash/
- No holiday greetings.

## Next up
1. ~~Confirm the deploy~~ (done). ~~v3 Daily Text always on~~ (done).
2. ~~v4 Listen button + QFR/BQA on from the start~~ (done).
3. ~~v5 Watch, v6 hearts, v7 lamp icon, v8 one feed + scrolling time, v9 more jw.org sources + posters, v10 Illustrated Bible Stories picture sets, v11 whole articles with headings, v12 no duplicate videos, v13 renamed GemStash + full-length Daily Text/articles~~ (done). v14 gems icon, v15 no player text in cards, v16 jw.org audio for Listen, v17 Share button, v18 auto-scroll, v19 friends & comments (Firebase gemstash-10786, rules in firestore.rules), v20 no edit button, v21 jw.org only, v22 voice skips (…) + WT refs, v23 books + PDF/EPUB upload, v24 WID video/audio/composite cards, v25 fresh updates (SW no-cache), v26 listen cards for QFR/BQA/BVE/FAM/ARCH, narrated only (from beta 9-10), v27 video full screen, v28 Morning Worship not zoomed, v29 full-screen fix, v30 A Day in the Life channel, v31 short convention videos, v32 more Watch channels, v33 Children's Activities, v34 Original Songs on, v35 Listen to the Bible, v36 same-day resume, v37 swipeable Bible Character Cards, v38 WID title card only, v39 problem report, v40 stuck-feed fix, v41 Daily Text EPUB~~ (done). Test changes in the BETA copy (`beta/`, its own storage) before porting to `app/`. Each beta: bump `BETA_NO` in beta/index.html and the beta SW cache. Mike's ideas: Claude outputs/GEMSTASH_CIRCLE_JW_HANDOFF.md. Direction: strictly jw.org, no uploads. When sources.js changes, bump `sources.js?v=N` in index.html. Next: see HANDOFF section 6 (Listening/driving mode, own e-books). Ask Mike which.
