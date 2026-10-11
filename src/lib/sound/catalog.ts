/**
 * CM Soundworks productions catalogue (ADR-013): `soundworks/catalog.json` in the R2 bucket,
 * edited from /admin and rendered in section [05] of sound.cardormedia.com.
 */
export interface Track {
	id: string;
	n: number;
	title: string;
	/** Short context line (where the cue plays in the game, mood…). */
	note?: string;
	/** Seconds. */
	duration: number;
	url: string;
	/** Bytes. */
	size: number;
	format: string;
}

export interface Release {
	id: string;
	title: string;
	subtitle?: string;
	kind: string;
	year: number;
	published: boolean;
	project?: { name: string; url?: string; studio?: string };
	description?: string;
	credits?: string;
	cover?: { large: string; web: string; alt: string };
	download?: { url: string; size: number; label: string };
	tracks: Track[];
}

export interface Catalog {
	version: 1;
	updatedAt: string;
	releases: Release[];
}

export const emptyCatalog = (): Catalog => ({ version: 1, updatedAt: '', releases: [] });

/** R2 key prefix owned by the Soundworks admin; nothing outside it can be written or deleted. */
export const PREFIX = 'soundworks/';
export const CATALOG_KEY = `${PREFIX}catalog.json`;

export const slug = (s: string) =>
	s
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60) || 'piste';

export const formatDuration = (s: number) => {
	if (!Number.isFinite(s) || s < 0) return '0:00';
	const m = Math.floor(s / 60);
	const r = Math.floor(s % 60);
	return `${m}:${String(r).padStart(2, '0')}`;
};

export const formatSize = (bytes: number) =>
	bytes >= 1e6
		? `${(bytes / 1e6).toLocaleString('fr-BE', { maximumFractionDigits: 0 })} Mo`
		: `${Math.max(1, Math.round(bytes / 1e3))} Ko`;

export const totalDuration = (r: Release) => r.tracks.reduce((a, t) => a + t.duration, 0);

/** ISO 8601 duration for schema.org. */
export const isoDuration = (s: number) => `PT${Math.floor(s / 60)}M${Math.round(s % 60)}S`;

const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0);
const httpsUrl = (v: unknown) => {
	const s = str(v, 500);
	try {
		return new URL(s).protocol === 'https:' ? s : '';
	} catch {
		return '';
	}
};

/** Validate untrusted input (the admin's JSON) into a clean catalogue. Throws on bad shape. */
export function sanitizeCatalog(input: unknown): Catalog {
	const raw = input as { releases?: unknown };
	if (!raw || !Array.isArray(raw.releases)) throw new Error('releases manquant');
	const ids = new Set<string>();
	const releases = raw.releases.slice(0, 50).map((r: Record<string, unknown>): Release => {
		const id = slug(str(r.id, 60) || str(r.title, 60));
		if (ids.has(id)) throw new Error(`identifiant en double : ${id}`);
		ids.add(id);
		const title = str(r.title, 120);
		if (!title) throw new Error('titre manquant');
		const p = (r.project ?? {}) as Record<string, unknown>;
		const c = (r.cover ?? null) as Record<string, unknown> | null;
		const d = (r.download ?? null) as Record<string, unknown> | null;
		const tracks = (Array.isArray(r.tracks) ? r.tracks : [])
			.slice(0, 200)
			.map((t: Record<string, unknown>, i: number): Track => {
				const url = httpsUrl(t.url);
				if (!url) throw new Error(`piste ${i + 1} : URL invalide`);
				return {
					id: slug(str(t.id, 60) || str(t.title, 60)),
					n: i + 1,
					title: str(t.title, 160) || `Piste ${i + 1}`,
					note: str(t.note, 240) || undefined,
					duration: num(t.duration),
					url,
					size: num(t.size),
					format: str(t.format, 40) || 'Audio'
				};
			});
		return {
			id,
			title,
			subtitle: str(r.subtitle, 160) || undefined,
			kind: str(r.kind, 30) || 'Album',
			year: Math.round(num(r.year)) || new Date().getFullYear(),
			published: r.published === true,
			project: str(p.name, 120)
				? {
						name: str(p.name, 120),
						url: httpsUrl(p.url) || undefined,
						studio: str(p.studio, 80) || undefined
					}
				: undefined,
			description: str(r.description, 2000) || undefined,
			credits: str(r.credits, 600) || undefined,
			cover:
				c && httpsUrl(c.large)
					? {
							large: httpsUrl(c.large),
							web: httpsUrl(c.web) || httpsUrl(c.large),
							alt: str(c.alt, 300)
						}
					: undefined,
			download:
				d && httpsUrl(d.url)
					? { url: httpsUrl(d.url), size: num(d.size), label: str(d.label, 120) || 'Album complet' }
					: undefined,
			tracks
		};
	});
	return { version: 1, updatedAt: new Date().toISOString(), releases };
}
