# RIM Website — Claude Instructions

## Workflow
- Never run a local dev server. Always push to GitHub; Vercel auto-deploys in ~1-2 min.
- Keep changes minimal and focused. No over-engineering or speculative improvements.
- Prefer editing existing files over creating new ones.

## CSS Rules
- Never edit `normalize.css`, `webflow.css`, or `rim.webflow.css`.
- All custom styles go in `src/css/custom.css` only.

## Key Files
- `src/_includes/layouts/base.njk` — master layout
- `src/_includes/partials/nav.njk` — single nav partial (`{% if memberArea %}` switches layout)
- `src/_includes/partials/footer.njk` — footer with newsletter form
- `src/js/nav.js` — custom nav script (replaced webflow.js)
- `api/subscribe.js` — Vercel function for Flodesk newsletter signup
- `vercel.json` — build config, headers, redirects

## Sanity / GROQ
- Always exclude drafts: `!(_id in path("drafts.**"))`
- `_type` values are plural (e.g. `"programs"` not `"program"`)
- `dayOfWeek` is an array ref: `dayOfWeek[]->` not `dayOfWeek->`

## Do Not
- Add webflow.js back — it was removed intentionally (1.1MB, caused mobile nav conflicts)
- Create two nav menus — mobile hamburger requires a single `w-nav-menu`
- Commit or expose API keys or secrets
