import { siFacebook, siInstagram, siTiktok, siWhatsapp, siYoutube } from "simple-icons";

export const LINE_ICONS = {
	gate: "M3 21V8l4-3 4 3v13M13 21V8l4-3 4 3v13M7 12v4M17 12v4M11 11h2M2 21h20",
	shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3zM8.5 12l2.5 2.5 4.5-5",
	road: "M7 3L4 21M17 3l3 18M12 4v3M12 10.5v3M12 17v3",
	lock: "M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 017 0V11M12 15v2",
	mosque:
		"M4 21V11M20 21V11M3 21h18M8 21v-6a4 4 0 018 0v6M12 6c2.8 1.2 5 3.4 5 6H7c0-2.6 2.2-4.8 5-6zM12 3v3M4 8.5V11M20 8.5V11",
	tree: "M12 21v-6M12 15c-3.9 0-6-2.2-6-5 0-2.4 1.6-4.2 3.4-4.8C10 3.9 11 3 12 3s2 .9 2.6 2.2C16.4 5.8 18 7.6 18 10c0 2.8-2.1 5-6 5zM8 21h8",
	building: "M4 21V5l8-2v18M12 8h8v13M2 21h20M7.5 8h1M7.5 12h1M7.5 16h1M15.5 12h1M15.5 16h1",
	badge:
		"M12 3l2.4 1.8 3-.1.9 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.9 2.9-3-.1L12 21l-2.4-1.8-3 .1-.9-2.9-2.4-1.8 1-2.8-1-2.8 2.4-1.8.9-2.9 3 .1L12 3zM8.5 12l2.5 2.5 4.5-5",
	bed: "M3 19V6M3 15h18v4M21 15v-3a3 3 0 00-3-3h-7v6M7 12.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
	bath: "M4 12h16v3a5 5 0 01-5 5H9a5 5 0 01-5-5v-3zM6 12V5.5A2.5 2.5 0 018.5 3c1.2 0 2.2.8 2.4 2M6 20l-1 2M18 20l1 2",
	bolt: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
	area: "M4 4h16v16H4zM4 9h5V4M15 20v-5h5",
	stairs: "M3 21h5v-5h5v-5h5V6h3M3 21V16",
	pin: "M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12zM12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
	phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
	mail: "M3 5h18v14H3zM3 6l9 7 9-7",
	check: "M5 12.5l4.5 4.5L19 7.5",
	menu: "M4 7h16M4 12h16M4 17h16",
	close: "M6 6l12 12M18 6L6 18",
	arrow: "M5 12h14M13 6l6 6-6 6",
	calendar: "M4 6h16v15H4zM4 10h16M8 3v5M16 3v5",
	camera: "M4 8h3l2-3h6l2 3h3v12H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
	hammer: "M14 7l-9.5 9.5a2 2 0 002.8 2.8L16.8 9.9M14 7l2-2 5 5-2 2-1.2-1.2M14 7l2.8 2.9",
	doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
	home: "M3 11l9-7 9 7M5 9.5V21h14V9.5M10 21v-6h4v6",
	"zoom-in": "M10.5 17a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM15.5 15.5L20 20M8 10.5h5M10.5 8v5",
	"zoom-out": "M10.5 17a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM15.5 15.5L20 20M8 10.5h5",
} as const;

export const BRAND_ICONS = {
	whatsapp: siWhatsapp.path,
	instagram: siInstagram.path,
	tiktok: siTiktok.path,
	facebook: siFacebook.path,
	youtube: siYoutube.path,
} as const;

export type IconName = keyof typeof LINE_ICONS | keyof typeof BRAND_ICONS;
