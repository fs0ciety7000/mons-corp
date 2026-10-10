/** Content model shared by the three division sites. */
export interface Title {
	before: string;
	em: string;
	after?: string;
}

export interface DivisionContent {
	hero: {
		kicker: string;
		lead: string;
		cta: { label: string; href: string };
		meta: string;
	};
	statement: { label: string; html: string };
	marquee: string[];
	offer: {
		id: string;
		label: string;
		title: Title;
		intro: string;
		items: { title: string; text: string; tags: string[] }[];
	};
	method: { id: string; label: string; title: Title; steps: { name: string; text: string }[] };
	emblem: { motif: string; title: Title; story: string[]; detail: string };
	soon?: { title: Title; text: string };
}
