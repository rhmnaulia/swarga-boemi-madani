# TODO

Open items, grouped by who unblocks them. Go-live and handover steps are in [handover.md](handover.md).

## Data from the client

Content that lives in code (`src/content/`):

- [ ] `tentang.ts` `PENDIRI`: short bio for Andyka Setyabudi Haryanto (and a photo, if allowed).
- [ ] `tentang.ts` `NILAI_CARE`: what each letter of CARE stands for. The section stays hidden while empty.
- [ ] `pembelian.ts` `ALUR_BELI`: booking fee, partner banks for KPR, cash schemes, typical duration.
- [ ] `lokasi.ts` `PATOKAN`: distance or travel time to each landmark.
- [ ] `lokasi.ts` `GEO`: exact coordinates of the site entrance (JSON-LD geo and the map pin).
- [ ] `konstruksi.ts`: confirm the service list, the cities served, and the working steps.
- [ ] `site.ts` `AGENCY_CREDIT`: agency name and link for the footer credit (needs client agreement).

Content managed in the admin:

- [ ] Prices (`harga` / `label_harga`) and remaining units (`sisa_unit`) per house type.
- [ ] Facebook and YouTube links in Pengaturan Situs.
- [ ] Real construction portfolio entries (2 example entries are hidden with `tampilkan: false`).
- [ ] Testimonials with written permission (1 example entry is hidden with `izin_tertulis: false`).
- [ ] Granada: the brochure shows a "Smart Lock Door" icon, but the entry has no features. Confirm.

Photos:

- [ ] Full-resolution originals: replace the files in `SBM_Foto_Website/` (same names), run `pnpm foto`,
      redeploy. House-type photos in the CMS (`sbm-*.webp` in Media) are replaced in the admin.
- [ ] Real photos of the gate, the 9 m main road, the mosque and the playground for Lokasi & Fasilitas.
- [ ] Written permission before using photos where buyers' faces are visible (ground-breaking photo).
- [ ] Logo as a vector or high-resolution file.

## Waiting on client approval

- [ ] Analytics (GA4) and the leads Sheet: [handover.md](handover.md) section B.
- [ ] Final domain, Cloudflare account transfer, admin accounts: [handover.md](handover.md) sections C to E.
