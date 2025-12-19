Accessibility report — quick audit

Scope
- Files reviewed: `index.html`, `assets/styles.css`, `assets/scripts.js`
- Focus: keyboard navigation, ARIA landmarks/labels, color contrast, modal accessibility.

Findings & Fixes applied

1) Landmarks and skip link
- Issue: No skip link and few explicit landmarks which can slow keyboard/screen-reader users.
- Fix: Added a visible `Skip to content` link and added `role="banner"` on header, `role="main"` on main, and `role="contentinfo"` on footer. Added `aria-label` to primary `nav`.

2) Modal accessibility
- Issue: Modal previously opened but needed stronger focus management.
- Fix: Implemented focus trap that cycles Tab/Shift+Tab inside modal and restore focus on close. Modal uses `aria-hidden` and exposes `aria-modal="true"` and `role="dialog"`.
- Recommendation: Add `aria-describedby` for longer text if needed, and ensure screen-reader users get context when the modal opens (we focus the close button).

3) Contrast
- Issue: Some muted text used very light tints on light theme; button text had a hard-coded color.
- Fix: Replaced hard-coded colors with theme variables and updated `--accent-contrast` for readable button text. Replaced several card borders to use `--card-border` variable so theme switching keeps consistent contrast.
- Recommendation: Run a full contrast scanner (axe, Lighthouse) on deployed pages to catch any other low-contrast elements, especially small meta text.

4) Icons
- Issue: Inline SVGs used `currentColor` and were fine; moved to external sprite for maintainability. Ensure `aria-hidden` on decorative icons.
- Fix: External `assets/icons.svg` plus `<svg><use></use></svg>` inserted; icons include `aria-hidden="true"`.

Remaining suggestions (not implemented automatically)
- Add `aria-describedby` on modal to point to content paragraph for screen-readers.
- Add `lang` attribute is present; ensure the content language is correct (already `lang="en"`).
- Validate tab order across the whole page after adding more interactive elements (e.g., project details buttons).
- Add landmarks for sections (`role="region"` with `aria-labelledby`) if you want screen readers to navigate sections more easily.

Tools to run for thorough audit
- axe-core (browser extension) — quick automated checks.
- Lighthouse accessibility audit (Chrome DevTools).
- Contrast checkers (e.g., WebAIM contrast checker) for any values you change.

If you want, I can:
- Run a Lighthouse/axe checklist locally and create a detailed report (requires running a browser audit and saving results).
- Implement `aria-describedby` for modal content and ensure live-region announcements when modal opens.
- Tighten contrast of `--muted` for light theme further if you want higher AA/AAA compliance for small text.


*** End of report
