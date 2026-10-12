# HyperFrames video workspace

This folder is a standalone HyperFrames project for making videos. It is separate from the Content Brain app.

## Quick start
Open Claude Code in this folder and ask, for example:
"Using /hyperframes, create a 15-second vertical TikTok intro about [topic]."

## Commands (run inside this folder)
- `npm run dev`: preview in the browser with live reload
- `npm run check`: check the composition for mistakes
- `npm run render`: render to MP4 (saved in `renders/`)

## Notes
- `index.html` is the video. `assets/` holds images, audio and the bundled GSAP animation library. GSAP is stored locally so renders work without CDN access.
- `.claude/skills/` holds the HyperFrames skills, so Claude Code loads them when opened here.
- Needs Node.js 22+ and FFmpeg.
