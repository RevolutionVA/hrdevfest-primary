---
target: sponsor page
total_score: 20
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
timestamp: 2026-10-29T14-16-14Z
slug: src-pages-sponsor-astro
---
# Critique: /sponsor (src/pages/sponsor.astro)

Method: dual-agent. Score 20/36 (7 n/a). Acceptable band (56%).

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 2 | "Available 1": total or remaining? No sold/held state. Stripe new tab + mailto unannounced |
| 2 | Match real world | 3 | Plain honest copy |
| 3 | User control | 2 | Bare mailto is the only reserve path; no refund/cancel policy |
| 4 | Consistency | 2 | Core table max-w-7xl vs 1040px elsewhere; mono vs sans tickets; CTA label drift; off-ramp font sizes (24/34/15px, 0.65rem) |
| 5 | Error prevention | 2 | mailto has no body template |
| 6 | Recognition | 2 | Base inclusions split across bullets, table, FAQ #06; How-to-sponsor at bottom says "above" |
| 7 | Flexibility | n/a | One-time decision surface |
| 8 | Minimalist | 2 | 9 FAQ groups / 49 bullets open; Community pitched 3x |
| 9 | Error recovery | 2 | mailto fails silently without mail client; no copyable address by red button |
| 10 | Help | 3 | FAQ thorough, undifferentiated |

Priority issues:
- [P1] Mobile "The day" table: nowrap "After conference closing" widens Time col; Sponsor-time column off-screen at 390px (adapt)
- [P1] Community $500 pitched 3x; mobile shows card button + second callout back-to-back; early band L585 anchors low (distill)
- [P1] Thin commit-moment reassurance: no mailto template, no copyable email, no what-happens-next, Stripe/receipt/refund/501c3 not stated at CTA (clarify)
- [P2] Sponsor proof missing though on hand: 2026 logos on plates, a testimonial (layout)
- [P2] Blueprint doesn't structure the decision: no callout marks on plan rooms keyed to schedules, no sheet refs on H2s (bolder)
- [P3] FAQ wall + How-to-sponsor buried; FAQ #05 metrics not nested (distill/layout)

Detector: 11 CLI (10 off-ramp font sizes, 1 flat hierarchy in mobile menu). Browser: 10.4px "Stage" label, ~130-149ch line lengths on desktop lists, 12 sub-44px tap targets (menu btn 42px, social 24px, footer links 20px), 2 unlabeled SVGs, seat dots rounded-[2px]. False positives: gradient-text, roboto, grid background, "Dream Theater", eyebrow label, all-caps mockup label. Contrast all AA.
