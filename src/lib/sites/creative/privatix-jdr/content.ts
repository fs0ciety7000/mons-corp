/**
 * « Privatix, le jeu de rôle » (CM Creative Lab): copy, downloads and previews of the
 * /privatix-jdr page. The PDFs, their manifest (file names, pages, sizes, sha256) and
 * SOURCE.md live in static/sites/creative/privatix-jdr/, written by the privatix-jdr repo's
 * scripts/sync-mons-corp.sh (never edited here). Nothing below names a PDF file.
 */
import manifest from '../../../../../static/sites/creative/privatix-jdr/manifest.json';

export const DIR = '/sites/creative/privatix-jdr';

interface ManifestFile {
	id: string;
	label: string;
	file: string;
	pages: number;
	bytes: number;
	sha256: string;
}

export const release = manifest as { version: string; commit: string; files: ManifestFile[] };

/** Page copy per manifest id; an unknown id falls back to the manifest's own label. */
const copy: Record<string, { title: string; detail: string }> = {
	'livret-ecran': { title: 'Livret A5 · écran', detail: 'Pour lire sur écran ou tablette' },
	'livret-impression': {
		title: 'Livret A5 · impression',
		detail: 'Fonds perdus et traits de coupe'
	},
	'fiches-personnage': { title: 'Fiches de personnage', detail: 'A4 · à remplir au crayon' },
	'ecran-de-la-voix': { title: 'Écran de la Voix', detail: 'A4 · les règles sous les yeux' },
	'cartes-complications': { title: 'Cartes de complication', detail: 'A4 · à découper' }
};

export interface Download {
	id: string;
	title: string;
	detail: string;
	href: string;
	/** Suggested name for the `download` attribute. */
	name: string;
	pages: number;
	size: string;
}

const plural = (n: number) => `${n} page${n > 1 ? 's' : ''}`;

export const files: Download[] = release.files.map((f) => ({
	id: f.id,
	title: copy[f.id]?.title ?? f.label,
	detail: copy[f.id]?.detail ?? '',
	href: `${DIR}/${f.file}`,
	name: f.file,
	pages: f.pages,
	size: formatSize(f.bytes)
}));

export const pagesLabel = (d: Download) => plural(d.pages);

/** The booklet itself (first file of the manifest is the screen edition). */
export const booklet = files.find((f) => f.id === 'livret-ecran') ?? files[0];

export const contents: { title: string; text: string; list?: string[] }[] = [
	{
		title: 'L’univers',
		text: 'Mons, sa gare, ses quais. Une mégacorporation veut tout optimiser ; une équipe en 3x8 tient la ligne.'
	},
	{
		title: 'Les règles « Tasse & Ballast »',
		text: 'Des dés, des Tasses de café et l’esprit d’équipe : dix minutes pour apprendre, une soirée pour jouer.'
	},
	{
		title: 'Six classes de cheminots',
		text: 'Six métiers du rail, chacun avec ses savoir-faire, son outil fétiche et ses répliques.'
	},
	{
		title: 'Un bestiaire de quinze adversaires',
		text: 'Des consultants aux automates, chacun avec sa menace et sa faiblesse.'
	},
	{
		title: 'Trois scénarios d’une soirée',
		text: 'Prêts à jouer, du briefing au dernier coup de sifflet.',
		list: ['Le dernier train', 'L’audit', 'La privatisation de la buvette']
	},
	{
		title: 'Des aides de jeu',
		text: 'Fiches de personnage, écran de la Voix et cartes de complication, à imprimer en A4.'
	}
];

export const previews = [
	{
		id: 'couverture',
		src: `${DIR}/apercu-couverture.webp`,
		width: 642,
		height: 909,
		caption: 'Couverture',
		alt: 'Couverture du livret : sur un quai de la gare de Mons, un cheminot en casque et gilet orange brandit une clé face à une foule de consultants en costume vert. Titre : Privatix, le jeu de rôle.'
	},
	{
		id: 'classe',
		src: `${DIR}/apercu-classe.webp`,
		width: 1284,
		height: 909,
		caption: 'Pages 26-27 · une classe de cheminot',
		alt: 'Double page de la classe Agent·e de manœuvre : portrait en casque et gilet orange, savoir-faire, outil fétiche (le pied-de-biche), atouts, revendications et répliques.'
	},
	{
		id: 'bestiaire',
		src: `${DIR}/apercu-bestiaire.webp`,
		width: 642,
		height: 909,
		caption: 'Page 43 · le bestiaire',
		alt: 'Page du bestiaire consacrée aux automates : la Borne automatique et le Drone optimètre, chacun avec son illustration, sa menace, sa faiblesse et ses attaques.'
	}
] as const;

/** « 2,9 Mo », « 81 Ko » (decimal units, French formatting). */
export function formatSize(bytes: number): string {
	const mb = bytes / 1e6;
	if (mb >= 1) return `${mb.toLocaleString('fr-BE', { maximumFractionDigits: 1 })} Mo`;
	return `${Math.max(1, Math.round(bytes / 1e3)).toLocaleString('fr-BE')} Ko`;
}
