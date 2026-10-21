import { ADDRESS, COMPANY, PROJECT_NAME, TAGLINE, WA_TEL } from "../content/site";
import { GEO } from "../content/lokasi";

/**
 * Public origin for canonical URLs, sitemap and JSON-LD. `EMDASH_SITE_URL` once the final domain is
 * set (M4), else the request's own origin. Never hardcoded.
 */
export function siteOrigin(url: URL): string {
	const configured = typeof process !== "undefined" ? process.env?.EMDASH_SITE_URL : undefined;
	try {
		if (configured) return new URL(configured).origin;
	} catch {
		// Malformed value: fall back to the request.
	}
	return url.origin;
}

export const OG_IMAGE = "/og.png";

const address = {
	"@type": "PostalAddress",
	streetAddress: `${ADDRESS.street}, ${ADDRESS.village}`,
	addressLocality: "Gombong",
	addressRegion: ADDRESS.province,
	addressCountry: "ID",
};

type Social = { instagram?: string; tiktok?: string; facebook?: string; youtube?: string } | null;

/** The developer and contractor, for the home and contact pages. */
export function businessLd(origin: string, social: Social) {
	const sameAs = [social?.instagram, social?.tiktok, social?.facebook, social?.youtube].filter(
		(u): u is string => Boolean(u),
	);
	return {
		"@context": "https://schema.org",
		"@type": "HomeAndConstructionBusiness",
		"@id": `${origin}/#business`,
		name: PROJECT_NAME,
		legalName: COMPANY,
		slogan: TAGLINE,
		url: `${origin}/`,
		image: `${origin}${OG_IMAGE}`,
		telephone: WA_TEL,
		address,
		areaServed: ["Gombong", "Kebumen"],
		...(GEO && { geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng } }),
		...(sameAs.length > 0 && { sameAs }),
	};
}

interface HouseLd {
	nama: string;
	slug: string;
	description: string;
	image?: string;
	luasBangunan: number;
	/** CMS text such as "3" or "4+1"; only a plain number goes into structured data. */
	kamarTidur: string;
	kamarMandi: string;
}

const count = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s) : undefined);

/** One house type, plus its breadcrumb. */
export function houseLd(origin: string, h: HouseLd) {
	const url = `${origin}/tipe-rumah/${h.slug}`;
	return [
		{
			"@context": "https://schema.org",
			"@type": "SingleFamilyResidence",
			name: `Rumah tipe ${h.nama}`,
			description: h.description,
			url,
			...(h.image && { image: h.image }),
			floorSize: { "@type": "QuantitativeValue", value: h.luasBangunan, unitCode: "MTK" },
			numberOfBedrooms: count(h.kamarTidur),
			numberOfBathroomsTotal: count(h.kamarMandi),
			address,
			containedInPlace: { "@id": `${origin}/#business` },
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Beranda", item: `${origin}/` },
				{ "@type": "ListItem", position: 2, name: "Tipe Rumah", item: `${origin}/tipe-rumah` },
				{ "@type": "ListItem", position: 3, name: `Tipe ${h.nama}`, item: url },
			],
		},
	];
}

/** JSON for a `<script type="application/ld+json">`; `<` is escaped so content cannot close the tag. */
export function ldJson(data: unknown): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}
