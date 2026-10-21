# Backlog

Ideas outside phase 1 scope (PLAN.md section 10). Do not build without a new agreement.

- Interactive per-lot masterplan
- KPR calculator
- **English version (EN/ID, default ID).** Requested 2026-10-21, deferred: PLAN.md section 10 lists
  multi-language as out of scope. Visitors are local, and full i18n doubles the admin's work on every
  update. Cheapest option when needed: Astro i18n routing with `/` as Indonesian and `/en/*` as English,
  translating only hardcoded text (`src/content/`, UI labels, SEO metadata) while CMS content stays
  Indonesian. About 1 day. Full i18n with EmDash locales (admin translates every entry) is not
  recommended for this client.
