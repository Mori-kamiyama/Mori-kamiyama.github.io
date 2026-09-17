# Scoped portfolio design QA

final result: passed

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
- Article preview measured at 92px with 30.8px line-height: approximately three lines. Full excerpt is 339px high. Its separate link opens the full article.
- Home checked at 320 / 375 / 544 / 768 / 1024 / 1512px: no horizontal overflow, all marquee images loaded.
- Browser console logs inspected: no errors observed.
- Reduced-motion behavior is specified in CSS and covered by the CI browser test; screenshots alone do not establish full accessibility compliance.

No actionable P0/P1/P2 visual issue remains within this update's scope. Information architecture improvements remain discussion items in `docs/portfolio-design-review.md`; they require verified owner-provided content.
