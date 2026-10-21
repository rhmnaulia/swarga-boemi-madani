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
| `LEADS_WEBHOOK_URL`     | Worker secret                        | Apps Script web app URL (M2)                                            |
| `LEADS_SECRET`          | Worker secret + Apps Script property | Shared secret; Apps Script rejects requests without it (M2)             |
| `PUBLIC_GA4_ID`         | build env                            | GA4 measurement ID (M2)                                                 |

Set secrets with `pnpm wrangler secret put <NAME>`. Never commit `.env`.

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
pnpm deploy
pnpm exec emdash doctor                              # checks scheduler wiring
```

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

## Cloudflare free-tier quotas

Checked from Cloudflare docs when writing this (Oct 2026). Re-check on the dashboard at deploy time.

| Product          | Free allowance                                                 | Expected use                       |
| ---------------- | -------------------------------------------------------------- | ---------------------------------- |
| Workers          | 100,000 requests/day, 10 ms CPU/request, 5 cron triggers       | Low hundreds/day; 1 cron           |
| D1               | 5M rows read/day, 100k rows written/day, 5 GB storage          | Mostly cache hits                  |
| R2               | 10 GB storage, 1M Class A + 10M Class B ops/month, free egress | Photos only                        |
| KV               | 100k reads/day, 1,000 writes/day, 1 GB                         | Cache writes on misses, well below |
| Images (binding) | 5,000 unique transformations/month                             | Few hundred image variants         |

## Data menyusul

Search `TODO(data)` for every placeholder. Seed data that is still placeholder (JSON has no comments):

- `house_type`: no `harga`, no `sisa_unit`, no photos. Granada `sisa-sedikit`, others `tersedia`.
- `construction_project`: 2 example entries with `tampilkan: false`.
- `testimonial`: 1 example entry with `izin_tertulis: false`.
- `pengaturan`: only WhatsApp and address; email and social links are empty.
- Brand colors in `src/styles/global.css` are placeholders until the logo hex values arrive.
