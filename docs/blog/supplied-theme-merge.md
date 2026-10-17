# Supplied theme merge

All five supplied files are retained verbatim in `reference/`. Their relevant styles are adapted into the blog's scoped CSS, so the existing grid, animated title and standalone article routes keep working.

| Source | Blog integration |
| --- | --- |
| `design.css` | Five local font faces; navy, deep-blue, white, orange and border tokens; uppercase Steinhart headings; Helvetica copy; mono labels; orange focus rings; rounded action links with sliding orange hover surfaces. |
| `brand.css` | PanVibes palette, muted `#45637d` descriptions, white surfaces and light blue supporting backgrounds. |
| `globals.css` | Its design-system foundation is represented by `app/brand-theme.module.css`; the standalone global reset stays in `app/globals.css`. |
| `journey.css` | Responsive spacing, compact controls, reversible hover movement and animated arrows. Its homepage-specific vehicle layout is not part of the blog. |
| `Navbar.tsx` | Retained as the supplied reference. Navigation remains removed as requested, so unavailable `Brand`, `Pill` and site-content imports are not introduced. |

The screenshot was inspected as a glass-surface reference. The user confirmed that tiles should continue opening full article pages, so no popup was added.

The hover animation repeats while the pointer remains in the stationary title scene. Leaving lets the current cycle finish, re-entry and taps restart immediately, and reduced-motion settings disable movement. All 27 blog images remain in full color.

Backgrounds follow the final `brand.css` overrides: the Blog title area uses the hero's `var(--blue)` (`#104e87`), the content canvas uses `.company-catalogue`'s `#f5f8fc`, and tiles retain `.catalogue-card`'s white. The hero has the reference's subtle white dot texture and light foreground copy. These override the earlier dark hero declarations in `journey.css`, matching the branded result.
