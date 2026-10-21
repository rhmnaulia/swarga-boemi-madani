import { describe, expect, it } from "vitest";
import { houseLd, ldJson } from "./seo";

describe("ldJson", () => {
	it("cannot be closed early by CMS text", () => {
		expect(ldJson({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
	});
});

describe("houseLd", () => {
	const base = { nama: "Alexandria", slug: "alexandria", description: "d", luasBangunan: 80 };

	it("keeps plain room counts and drops ones like 4+1", () => {
		const [house] = houseLd("https://x.id", { ...base, kamarTidur: "4+1", kamarMandi: "4" });
		expect(house).toMatchObject({
			numberOfBathroomsTotal: 4,
			url: "https://x.id/tipe-rumah/alexandria",
		});
		expect(JSON.parse(ldJson(house))).not.toHaveProperty("numberOfBedrooms");
	});
});
