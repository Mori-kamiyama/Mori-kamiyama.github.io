# Portfolio content refinement QA

final result: passed

## Current scope and comparison

Latest update: duplicate Home CTAs removed (Works/Blog each retain one arrow link); the visible motion control becomes keyboard-only, with tap-to-toggle on the marquee. Five verified recent works added, for 21 total. Current evidence folder: `/Users/yuta/.codex/visualizations/2026/09/17/portfolio-expansion/`. `home-blog-before.png` captures the original two Works CTAs above Blog; the mistakenly positioned `works-before.png` was rejected. `works-after.png` shows the new original project assets and 21-item count. Local check/build passes; 29 HTML files and 966 local URLs verified. Source/asset references are documented in `docs/recent-work-sources.md`.

`comparison.png` compares the current-run published Home Blog capture (`blog-source.png`, left) and the local implementation (`home-blog-after.png`, right) at the same normal viewport, normalized to 544 × 683. Fonts, gutter, colors, source article copy and three-line fade match; the duplicate continuation CTA is removed as requested. DOM confirms Works/Blog each have one arrow CTA, Works has no extra button, Home Blog has no separate continuation CTA. In-app tapping the real Skills row toggles persistent pause `true` then `false`; the visible stop button is absent in normal pointer use. Keyboard-only control and reduced-motion behavior are covered in the updated CI regression. No actionable P0/P1/P2 issue found in this scope.

The existing visual target is retained. The owner greeting now precedes the About policy; the actual portfolio production record replaces the general AI essay as the recommendation; Home can expand all 16 existing works.

Current-run evidence: `/Users/yuta/.codex/visualizations/2026/09/17/portfolio-refinement/`.

- `comparison.png`: About and Blog before/after pairs inspected together, before on the left. Captures use the normal 544 × 683 CSS-pixel viewport, normalized to that size. About anchor scroll positions differ, so absolute vertical positions are not treated as a pixel comparison.
- `about-before.png` / `about-after.png`: the greeting is copied from the verified Profile page and appears in normal flow before the policy.
- `blog-before.png` / `blog-after.png`: production record, date, three-line excerpt and continuation link. The AI essay remains available under “考えたこと”.
- `article-after.png`: original concept sheet and initial design image embedded in the actual production record.
- `about-desktop.png`: original illustration/policy composition retained at 1512 × 982; temporary viewport override reset.

Typography and colors retain Figtree / Noto Sans JP and existing tokens. Spacing retains existing gutters and rule lines; the greeting does not overlap the illustration. Assets are the original supplied design materials. No new work, role, result, or personal opinion has been invented.

Pointer activation of “このページで全16件を見る” verified in-app: preview height becomes `none`, 16 cards are present, no horizontal overflow. Keyboard expansion remains persistent. Blog excerpt measured at 92px / 30.8px line-height, approximately three lines, with 246px of complete text. Markdown image syntax is excluded from excerpts.

Local Astro check: zero errors/warnings/hints. Production build verifies 24 HTML files and 792 local URLs. Updated CI regression coverage checks pointer expansion as well as the existing keyboard/full-content routes. Improved visibility does not increase the number of underlying projects; new case studies require real owner-provided material.

## Previous scoped update evidence

The remaining sections record the prior Skills/fade update and its checks, before this content refinement.

## Target and evidence

Source: the existing published portfolio, captured in this audit at `https://mori-kamiyama.github.io/`. The user's requested changes intentionally add a two-row Skills marquee with white edge fades, a faded Home Works preview, and a three-line article preview. This is a scoped update to the existing visual target, not a new design.

Evidence folder: `/Users/yuta/.codex/visualizations/2026/09/17/portfolio-audit/`.

- Source visual truth: `01-home.png`, `02-skills.png`, `06-blog.png`.
- Implementation screenshots: `08-home-updated.png`, `07-skills-updated.png`, `09-blog-updated.png`, `10-works-updated.png`.
- Combined comparison: `comparison.png`, source on the left and implementation on the right, Home / Skills / Blog in order.
- Viewport: 544 × 683 CSS px. Source screenshots: 531 × 668 px; implementation: 529 × 664 px. Browser screenshots have slight presentation scaling. Both sides normalized to 544 × 683 px for the comparison; this is a layout comparison, not a pixel-diff assertion. Implementation devicePixelRatio: 1. Skills scroll positions differ because the update adds a second row and a stop control; this is recorded rather than interpreted as spacing drift.

## Fidelity surfaces

- Fonts and typography: existing Figtree / Noto Sans JP retained. Article title, headings and body rhythm remain consistent. The article's third line fades as requested; full content remains available through a separate link.
- Spacing and layout: existing gutters and grid retained. Skills gains a second row; the stop control wraps beneath the heading at narrow widths. Works preview fades over its final 180px. The full-list link stays outside the masked area.
- Colors and tokens: existing black, white and muted text retained. Fades are CSS masks over the real content, not replacement image assets.
- Image quality and fidelity: supplied tool icons and work imagery retained. Initial review found a low-resolution image selection on narrow, square Home portraits. Corrected responsive `sizes` to account for the cover crop without changing composition; Profile gets the same correction for its mobile crop. Revised Home capture is sharp.
- Copy and content: public profile and work claims unchanged. Recommended articles now use their real Markdown opening paragraphs instead of the short description. No new claims about roles or results are published.

Focused comparison uses the readable Skills icons/control and Blog title/body/link within the combined comparison. Separate Works bottom screenshot shows the fade and the unaffected navigation link. Hero comparison checks crop, typography and image quality.

## Comparison history and interaction checks

- P2: narrow-screen portrait selected too few pixels for its `object-fit: cover` crop. Fixed Home `sizes` to 226vw and Profile to 157vw at the mobile breakpoint. Post-fix screenshot: `08-home-updated.png`, included in the combined comparison.
- Stop and resume both verified in the in-app browser: each row reports `paused`, then `running`; the second row has reverse direction. Repeated groups are hidden from the accessibility tree.
- Keyboard Tab reaches all eight Home work links. Focusing a work removes the height cap and mask. The last work's focus ring is visible in the viewport after browser scrolling settles.
- P1 interaction finding in CI: after keyboard expansion, clicking the full-list link removed focus from the preview and collapsed it during the click, moving the target before mouse-up. Fix: persist `.is-expanded` after keyboard focus enters a work link, so the preview stays open for the remainder of the page visit. Post-fix in-app browser verification reached `/works/` with 16 cards after Tab through all eight Home links and a mouse click. Evidence: `11-keyboard-to-mouse-fixed.png`. Regression test retains this path and requires the destination URL and all 16 works.
- Article preview measured at 92px with 30.8px line-height: approximately three lines. Full excerpt is 339px high. Its separate link opens the full article.
- Home checked at 320 / 375 / 544 / 768 / 1024 / 1512px: no horizontal overflow, all marquee images loaded.
- Browser console logs inspected: no errors observed.
- Reduced-motion behavior is specified in CSS and covered by the CI browser test; screenshots alone do not establish full accessibility compliance.

No actionable P0/P1/P2 visual issue remains within this update's scope. Information architecture improvements remain discussion items in `docs/portfolio-design-review.md`; they require verified owner-provided content.

## Approved article sharing cards

The owner approved the two article-card previews on 2026-09-17. The production PNGs retain their white canvas, black type, top-left `<portfolio/>`, central `#` heading and bottom-left author. Both generated 1200 × 630 images were visually compared with the approved previews; spacing and line breaks match the intended composition, with no missing Japanese glyphs or clipped text.

Each blog page now references its own static PNG in Open Graph and Twitter metadata. Sharp, already used by Astro, renders bundled OFL fonts during the build; the full fonts are build inputs and do not increase browser font downloads. Optional `ogTitle` only controls card line breaks; article titles remain unchanged. New articles get cards from `title` automatically. The common Figma cover remains the default for other pages.

Local Astro checks passed with zero errors/warnings, and the built site's 29 HTML files and 966 local URLs passed validation. CI additionally checks each article's image URL, PNG signature and 1200 × 630 dimensions on desktop and mobile. No actionable visual issue remains within this card update's scope.
