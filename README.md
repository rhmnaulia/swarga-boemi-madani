# Swarga Boemi Madani Residence: website

Website perumahan Swarga Boemi Madani Residence (PT. Abyakta Sadawira Bangun Mandiri).
Astro (SSR) di Cloudflare Workers, konten dikelola lewat EmDash CMS di `/_emdash/admin`.
Brief lengkap: [PLAN.md](PLAN.md).

## Stack

| Part      | Choice                                                |
| --------- | ----------------------------------------------------- |
| Framework | Astro 7, `output: "server"`, `@astrojs/cloudflare`    |
| CMS       | EmDash 1.3.1 (versi dikunci, jangan upgrade otomatis) |
| Database  | Cloudflare D1, binding `DB`                           |
| Media     | Cloudflare R2, binding `MEDIA`                        |
| Cache     | Cloudflare KV, binding `CACHE` (EmDash `kvCache`)     |
| Gambar    | Cloudflare Images, binding `IMAGES`                   |
| Styling   | Tailwind CSS 4, font Plus Jakarta Sans (self-host)    |
| Leads     | `/api/lead` -> Google Apps Script -> Google Sheet     |

All dependency versions are pinned exactly (`.npmrc` has `save-exact=true`). Upgrade EmDash only on purpose,
after reading its changelog, and test the admin before deploying.

## Develop

Requires Node >= 22.22 and pnpm 11.

```bash
pnpm install
pnpm dev                 # http://localhost:4321, admin at /_emdash/admin
```

`pnpm dev` runs the Worker locally (Miniflare): D1/R2/KV live under `.wrangler/state`.
On a fresh database the seed schema is applied on first request. Then either:

- open `/_emdash/admin` and finish the setup wizard (tick sample content), or
- skip passkeys locally with `http://localhost:4321/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin`
  and load the seed content into the local D1 file:

  ```bash
  pnpm exec emdash seed seed/seed.json --database .wrangler/state/v3/d1/miniflare-D1DatabaseObject/<hash>.sqlite
  ```

Leads locally: `cp .dev.vars.example .dev.vars`. With the values empty, `/api/lead` logs each lead to the
terminal instead of sending it. To write to a real test Sheet, fill both values (see
[scripts/apps-script/README.md](scripts/apps-script/README.md)) and restart `pnpm dev`.

Link prefetch (`prefetch` in `astro.config.mjs`) only runs in the built site (`pnpm build && pnpm preview`),
not in `pnpm dev`.

Other scripts:

```bash
pnpm check               # astro check (types)
pnpm test                # vitest
pnpm format              # prettier
pnpm seed:validate       # validate seed/seed.json
pnpm build
```

## Content model

Defined in `seed/seed.json` (source of truth, in git). EmDash requires snake_case slugs and reserves
`status`, so names differ slightly from the brief:

| Collection             | Brief name            | Notes                                                       |
| ---------------------- | --------------------- | ----------------------------------------------------------- |
| `house_type`           | `houseType`           | availability field is `ketersediaan` (`status` is reserved) |
| `progress_update`      | `progressUpdate`      |                                                             |
| `construction_project` | `constructionProject` | only entries with `tampilkan = true` are shown              |
| `testimonial`          | `testimonial`         | only entries with `izin_tertulis = true` are shown          |
| `pengaturan`           | `siteSettings`        | one entry; EmDash site settings have no custom fields       |

Collection slugs cannot be renamed after creation. Hardcoded content (keunggulan, fasilitas, legalitas, teks
tentang) lives in `src/content/`.

## Environment & secrets

| Name                    | Where                                | Purpose                                                                 |
| ----------------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| `EMDASH_SITE_URL`       | Worker var                           | Public origin. **Set before admin setup**: passkeys bind to this origin |
| `EMDASH_ENCRYPTION_KEY` | Worker secret, `.env` locally        | Encrypts plugin secrets. **Back up** (see below)                        |
| `LEADS_WEBHOOK_URL`     | Worker secret, `.dev.vars` locally   | Apps Script web app URL (`…/exec`)                                      |
| `LEADS_SECRET`          | Worker secret + Apps Script property | Shared secret; Apps Script rejects requests without it                  |
| `PUBLIC_GA4_ID`         | `.env` at build time                 | GA4 measurement ID (`G-…`). Empty = no GA4                              |

Set secrets with `pnpm wrangler secret put <NAME>`. Never commit `.env` or `.dev.vars`.

## Leads & tracking

- Every WhatsApp link goes through `buildWaLink` (`src/lib/wa.ts`) and carries `data-wa`. A tap sends GA4
  `wa_click` (`page`, `house_type`) and a beacon to `/api/lead`.
- The source (`utm_*`, outside referrer) is read on the first page of a visit and kept in `sessionStorage`.
- The survey form is a plain HTML form post: it works without JS. `/api/lead` validates it
  (`src/lib/lead.ts`), waits for the Sheet to confirm, then redirects to `/terima-kasih`. If the Sheet is
  unreachable the visitor goes back to the form with an error and a WhatsApp option, so a lead is never
  reported as sent when it was not.
- `/terima-kasih` sends GA4 `form_survei` once. Names and phone numbers never go to GA4 or into URLs.
- Apps Script setup (Bahasa Indonesia, for the client): [scripts/apps-script/README.md](scripts/apps-script/README.md).

GA4 setup: create a property and a Web data stream for the final domain, copy the measurement ID into `.env`
as `PUBLIC_GA4_ID`, rebuild and deploy. In GA4 Admin > Events, mark `wa_click` and `form_survei` as key events.
gtag.js loads after the page is idle, so page views from visitors who leave in the first second or two are not
counted.

### Backup `EMDASH_ENCRYPTION_KEY`

The scaffold generated a key in `.env`. The production key must be stored in the **client's password manager**
before go-live. Without it, encrypted plugin secrets cannot be decrypted. Rotation accepts comma-separated keys
(new first).

## Deploy (not done yet: waiting for the client's Cloudflare account)

Run once on the client's account:

```bash
pnpm wrangler login
pnpm wrangler d1 create swarga-boemi-madani          # add database_id to wrangler.jsonc
pnpm wrangler r2 bucket create swarga-boemi-madani-media
pnpm wrangler kv namespace create CACHE              # add id to wrangler.jsonc
pnpm wrangler secret put EMDASH_ENCRYPTION_KEY
pnpm deploy                                          # then purge the zone cache, see "SEO & caching"
pnpm exec emdash doctor                              # checks scheduler wiring
```

On the first request EmDash migrates the empty D1 database (90+ migrations). For a minute or so some pages may
answer 503 until every Worker isolate retries; they recover on their own. `src/worker.ts` marks 5xx responses
`no-store` so an error never sits in the edge cache. To migrate ahead of traffic instead:
`CLOUDFLARE_API_TOKEN=… pnpm exec emdash migrate --from-config --account-id <id>`.

The Images binding needs Cloudflare Images enabled on the account (free plan is enough).
The SESSION KV binding is added automatically by the Astro Cloudflare adapter.

### Domain, passkeys and login fallback

- The domain must be managed in the **same Cloudflare account** as the Worker (`routes` with
  `custom_domain: true` in `wrangler.jsonc`).
- Passkeys only work on the origin where they were created. Until the final domain is decided, use
  `workers.dev` for development only, then set `EMDASH_SITE_URL` and redo admin setup on the final domain.
- Magic-link login (fallback when an admin changes phone) needs an email provider: the `cloudflareEmail`
  plugin plus a verified sender domain in Cloudflare Email Sending. That depends on the final domain, so it is
  set up at go-live. Until then, have each admin register a second passkey (up to 10 per user).
- No sandboxed/marketplace plugins in phase 1, so no `LOADER` (Dynamic Workers) binding.

## SEO & caching

- Every page gets title, description, canonical, Open Graph and Twitter tags through `Base.astro`. Canonical and
  sitemap URLs use `EMDASH_SITE_URL` when set, otherwise the request origin, so the domain is never hardcoded.
- `/sitemap.xml` (`src/pages/sitemap.xml.ts`) lists the code pages plus every house type from the CMS. It replaces
  EmDash's built-in sitemap, which only lists collections. `/robots.txt` is EmDash's (blocks `/_emdash/`).
- JSON-LD: `HomeAndConstructionBusiness` on `/` and `/kontak`, `SingleFamilyResidence` + breadcrumb on each house
  type (`src/lib/seo.ts`). Add `GEO` in `src/content/lokasi.ts` once the coordinates are confirmed.
- `public/og.png`, `favicon.svg/ico` and `apple-touch-icon.png` are placeholders built from the site colors.
  TODO(data): replace with the real logo. A house type with `foto_utama` uses that photo as its share image.
- Pages are cached at Cloudflare's edge (`cache` + `routeRules` in `astro.config.mjs`: 5 min, then
  stale-while-revalidate 1 h). EmDash purges the affected pages by tag when content is published, including
  scheduled publishing by the cron, so admin edits still show at once. The editor toolbar runs in `client` mode
  so cached HTML is the same for everyone.
- After a code deploy, purge the zone cache (Cloudflare dashboard > Caching > Purge Everything) so no cached page
  points at old CSS/JS files.

Lighthouse mobile, local production build (`pnpm build && pnpm preview`), Oct 2026, placeholder images:
Performance 98-100, Accessibility 100, Best Practices 100, SEO 100 on every page; home at 6x CPU slowdown:
Performance 99. Re-run after real photos are uploaded.

## Cloudflare free-tier quotas

Checked from Cloudflare docs when writing this (Oct 2026). Re-check on the dashboard at deploy time.

| Product          | Free allowance                                                 | Expected use                       |
| ---------------- | -------------------------------------------------------------- | ---------------------------------- |
| Workers          | 100,000 requests/day, 10 ms CPU/request, 5 cron triggers       | Low hundreds/day; 1 cron           |
| D1               | 5M rows read/day, 100k rows written/day, 5 GB storage          | Mostly cache hits                  |
| R2               | 10 GB storage, 1M Class A + 10M Class B ops/month, free egress | Photos only                        |
| KV               | 100k reads/day, 1,000 writes/day, 1 GB                         | Cache writes on misses, well below |
| Images (binding) | 5,000 unique transformations/month                             | Few hundred image variants         |

## Handover

Analytics and leads are set up only after the client agrees. The full go-live and handover checklist is in
[docs/handover.md](docs/handover.md). Admin guide for the client: [docs/panduan-admin.md](docs/panduan-admin.md).

## Data menyusul

Search `TODO(data)` for every placeholder. Seed data that is still placeholder (JSON has no comments):

- `house_type`: no `harga`, no `sisa_unit`, no photos. Granada `sisa-sedikit`, others `tersedia`.
- `construction_project`: 2 example entries with `tampilkan: false`.
- `testimonial`: 1 example entry with `izin_tertulis: false`.
- `pengaturan`: only WhatsApp and address; email and social links are empty.
- Brand colors in `src/styles/global.css` are sampled from a logo image in the discovery PDF; confirm against
  the source logo file.
