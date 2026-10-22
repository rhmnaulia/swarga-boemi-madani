import { ADDRESS, COMPANY, PROJECT_NAME, TAGLINE, WA_TEL } from "../content/site";
import { GEO } from "../content/lokasi";

export function siteOrigin(url: URL): string {
	const configured = typeof process !== "undefined" ? process.env?.EMDASH_SITE_URL : undefined;
	try {
		if (configured) return new URL(configured).origin;
	} catch {}
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
	kamarTidur: string;
	kamarMandi: string;
}

const count = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s) : undefined);

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

export function ldJson(data: unknown): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}
