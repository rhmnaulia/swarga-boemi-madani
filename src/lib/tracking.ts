declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
	}
}

const KEY = "sbm_attribution";
const UTM = ["utm_source", "utm_medium", "utm_campaign"] as const;

type Attribution = Record<(typeof UTM)[number] | "referrer", string>;

function attribution(): Attribution {
	try {
		const saved = sessionStorage.getItem(KEY);
		if (saved) return JSON.parse(saved) as Attribution;
	} catch {}
	const query = new URLSearchParams(location.search);
	let referrer = "";
	try {
		const ref = new URL(document.referrer);
		if (ref.host !== location.host) referrer = ref.href;
	} catch {}
	const a = {
		utm_source: query.get("utm_source") ?? "",
		utm_medium: query.get("utm_medium") ?? "",
		utm_campaign: query.get("utm_campaign") ?? "",
		referrer,
	};
	try {
		sessionStorage.setItem(KEY, JSON.stringify(a));
	} catch {}
	return a;
}

export function initTracking() {
	const source = attribution();

	document.querySelectorAll<HTMLFormElement>("form[data-survey-form]").forEach((form) => {
		for (const [name, value] of Object.entries(source)) {
			const input = form.elements.namedItem(name);
			if (input instanceof HTMLInputElement) input.value = value;
		}
	});

	document.addEventListener("click", (e) => {
		const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-wa]");
		if (!link) return;
		const page = location.pathname;
		const house_type = link.dataset.houseType ?? "";
		window.gtag?.("event", "wa_click", { page, house_type, transport_type: "beacon" });
		const body = JSON.stringify({ event: "wa_click", page, house_type, ...source });
		try {
			navigator.sendBeacon("/api/lead", new Blob([body], { type: "text/plain" }));
		} catch {}
	});
}
