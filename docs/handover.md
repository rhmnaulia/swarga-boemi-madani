# Handover checklist

The site currently runs on the developer's personal Cloudflare account
(`swarga-boemi-madani.rahmanauliax.workers.dev`), for testing only. Everything below happens once the client
agrees. Work top to bottom: later steps depend on earlier ones.

## A. Client approval and accounts

- [ ] Client approves the site (design, copy, data) on the workers.dev address.
- [ ] Client provides or creates: a company Google account, a Cloudflare account, and a GitHub account (or
      decides the repo stays with the agency).
- [ ] Decide the final domain. It must be managed in the **client's** Cloudflare account.
- [ ] Agreement on: portfolio photo permission, testimonial permission, footer credit (`AGENCY_CREDIT` in
      `src/content/site.ts`), agency access to leads data for 2 to 3 months.

## B. Analytics and leads (not implemented on purpose until the client agrees)

The code is in place and dormant: no GA4 tag loads while `PUBLIC_GA4_ID` is empty, and the survey form shows
"belum terkirim" while the leads secrets are missing.

- [ ] Google Sheet + Apps Script on the **client's** Google account: follow
      [scripts/apps-script/README.md](../scripts/apps-script/README.md).
- [ ] GA4 property + Web stream for the final domain on the client's Google account. Mark `wa_click` and
      `form_survei` as key events. Add the agency as a user if agreed.
- [ ] Google Search Console for the final domain; submit `/sitemap.xml`.

## C. Cloudflare on the client's account

- [ ] `pnpm wrangler login` with the client's account.
- [ ] Create D1, KV `CACHE`, R2 bucket (README "Deploy"); put the new IDs in `wrangler.jsonc`, replacing the
      personal-account IDs.
- [ ] Enable R2 and Images (free plans). Set a billing notification.
- [ ] New `EMDASH_ENCRYPTION_KEY` (`pnpm exec emdash secrets generate`), stored in the **client's** password
      manager, then `pnpm wrangler secret put EMDASH_ENCRYPTION_KEY`.
- [ ] `pnpm wrangler secret put LEADS_WEBHOOK_URL` and `LEADS_SECRET` (from B).
- [ ] `.env`: `PUBLIC_GA4_ID=G-…` (from B), then build.
- [ ] Custom domain in `wrangler.jsonc` (`routes` with `custom_domain: true`) and `EMDASH_SITE_URL` var set to
      the final origin.
- [ ] `pnpm run deploy`. First request runs the database migrations (README).
- [ ] Purge the zone cache after the deploy.

## D. Content and admin accounts on the final domain

- [ ] Move content from the personal deployment: admin **Pengaturan > Cadangan** (download) or
      **Pengaturan > Transfer**, or `pnpm exec emdash site export` / `import`. Check that photos (R2) came along.
- [ ] Admin setup on the final domain (passkeys are tied to the domain; workers.dev passkeys do not carry over).
- [ ] Email for magic-link login: `cloudflareEmail` plugin + verified sender on the final domain.
- [ ] Invite the owner as **Admin** and the daily admin as **Penyunting**. Each registers a backup passkey.
- [ ] Logo uploaded (Pengaturan > Umum); replace `public/og.png`, `favicon.*`, `apple-touch-icon.png`
      (`TODO(data)`), brand colors from the logo in `src/styles/global.css`.
- [ ] `GEO` coordinates in `src/content/lokasi.ts`.

## E. Verify, hand over, clean up

- [ ] Brief section 13 checks: Lighthouse mobile >= 90 on home and a house type (with real photos), every WA
      button opens 0811-2052-225 with the right message, WA clicks and the form land in the Sheet, admin
      changes show at once, no NPWP anywhere, testimonials only with `izin_tertulis`.
- [ ] Walk the client admin through [docs/panduan-admin.md](panduan-admin.md) on their own phone; fill in the
      screenshot placeholders.
- [ ] Transfer: Cloudflare (already client's), Google Sheet ownership, GA4 admin, GitHub repo.
- [ ] Remove the agency from accounts the client does not want it in.
- [ ] Delete the personal-account resources: Worker `swarga-boemi-madani`, D1, KV `CACHE` and
      `swarga-boemi-madani-session`, R2 `swarga-boemi-madani-media`.
