# Gatto Custom Guitars

A website for Frank Gatto's instruments, craft, and musical background.

Website: https://billthorpe522.github.io/gatto-guitars/

Original private Sites address: https://gatto-guitars-study.evildroid.chatgpt.site (owner sign-in required).

For a local preview, run `npm start`, then open http://127.0.0.1:4173. The server binds only to this computer's loopback interface. The GitHub repository and GitHub Pages website are public. The original Sites address retains owner-only access. It has no order form, payment system, analytics, or outbound messaging. Fonts and displayed images are local.

## Contents

- 45 pages: home, collection, maker, craft, retailer connections, sources, and 39 record pages.
- 37 guitar listing records and 2 related items from Evolution Music's public archive.
- 305 original retailer images, plus Frank's band photo and original headstock-reference images.
- 3 AI-assisted campaign/material assets, including a custom walnut-grain background. Actual instrument galleries remain original retailer photography.
- Responsive navigation, image galleries, keyboard-accessible enlarged viewing, and per-page titles/descriptions.

## Publishing

GitHub Pages serves the `gh-pages` branch. After committing and pushing source changes to `main`, run `node scripts/publish-github-pages.mjs` to build, validate, and push the public website. The publisher uses the existing GitHub Git login and requires no workflow permission. `scripts/prepare-github-pages.mjs` creates the ignored `.github-pages/` output with project-prefixed links and fonts, leaving the root-based `dist/` output compatible with Sites and local previews. Website pages currently retain `noindex` metadata.

## Working on it

`scripts/build.mjs` generates the HTML pages from `research/catalog.json`. Edit page copy/layouts there; rebuild with `npm run build`. `dist/style.css`, `dist/finish.css`, and `dist/app.js` are authored directly and preserved by the build. `npm run check` validates local references, image alt attributes, page metadata, fragments, and HTTP responses while the local server is running.

`scripts/collect.mjs` can refresh public source records and galleries, but it is a deliberate research refresh, not a live inventory sync. It scans the retailer's product sitemap index and retains Gatto entries. `scripts/trace-logo.mjs` transcribes the actual photographed headstock mark as an SVG. `scripts/prepare-assets.mjs` converts the generated PNG files for efficient delivery and downloads fonts. The two asset scripts currently refer to this machine's bundled image runtime.

## Research and provenance

See `research/RESEARCH.md`, `research/catalog.json`, `research/image-prompts.json`, and the site's `/sources/` page. Records may include repeat sales; 37 records do not establish 37 distinct instruments. Archived asking prices are not sale prices. Stock is a dated retailer snapshot.

The brand restoration is traced from a photograph, not original production artwork. The generated logo attempt was rejected because it had visual artifacts; the site uses the photographed mark instead. Photography reuse permissions remain unverified for a public launch. Research notes retain the original provenance and project history.
