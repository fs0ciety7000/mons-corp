import type { DivisionContent } from '#lib/sites/division/types.ts';

export const content: DivisionContent = {
	hero: {
		kicker: '[CM—01] Jeux vidéo & développement web',
		meta: 'Mons — 50.4542° N, 3.9523° E',
		lead: 'Nous forgeons des mondes jouables et des expériences web taillées pour durer. Un studio, deux métiers, la même exigence.',
		cta: { label: 'Voir les projets', href: '#projets' }
	},
	statement: {
		label: 'Manifeste',
		html: 'Nous croyons qu’un site <em>se joue</em> et qu’un jeu <em>se visite</em>. Entre le code et le récit, nous forgeons des mondes qui tiennent debout : rapides, lisibles, et qu’on a envie de rouvrir.'
	},
	marquee: ['Jeux vidéo', 'Sites web', 'Applications', 'Outils métier', 'Direction artistique'],
	offer: {
		id: 'disciplines',
		label: 'Disciplines',
		title: { before: 'Deux métiers,', em: 'une forge.' },
		intro:
			'Le jeu et le web partagent le même socle : du temps réel, de la donnée, une interface qui répond. Nous les pratiquons sous le même toit, avec les mêmes outils et la même rigueur.',
		items: [
			{
				title: 'Jeux vidéo',
				text: 'Jeux de stratégie persistants, action 3D et arcade, jouables directement dans le navigateur et sur desktop. Économie, équilibrage, multijoueur temps réel, direction artistique.',
				tags: ['Game design', 'Temps réel', 'Équilibrage', 'Three.js']
			},
			{
				title: 'Web & applications',
				text: 'Sites vitrines, applications métier et applications mobiles. Rapides, accessibles et simples à faire évoluer, du prototype à la production.',
				tags: ['SvelteKit', 'Next.js', 'Android natif', 'Accessibilité']
			},
			{
				title: 'Expériences WebGL',
				text: 'Scènes 3D temps réel, shaders et motion design pour les marques : le niveau d’exigence d’un jeu, au service d’un site.',
				tags: ['WebGL', 'GLSL', 'GSAP', 'Performance']
			},
			{
				title: 'Outils métier',
				text: 'Postes de pilotage, mains courantes et tableaux de bord pour les équipes d’exploitation. Accès par rôles, temps réel, exports.',
				tags: ['PWA', 'Temps réel', 'PDF', 'Rôles']
			}
		]
	},
	method: {
		id: 'methode',
		label: 'Méthode',
		title: { before: 'Du minerai brut', em: 'au monde en ligne.' },
		steps: [
			{
				name: 'Esquisse',
				text: 'Cadrer le besoin, le public et l’univers. Maquettes et prototypes jouables.'
			},
			{
				name: 'Forge',
				text: 'Développer par itérations courtes, testées, versionnées et déployées en continu.'
			},
			{
				name: 'Trempe',
				text: 'Éprouver : tests, audits de performance et d’accessibilité, essais sur appareils réels.'
			},
			{
				name: 'Lancement',
				text: 'Mettre en production, surveiller, publier les notes de version et faire évoluer.'
			}
		]
	},
	emblem: {
		motif: 'Le Dragon du Doudou',
		title: { before: 'Forgé à l’ombre', em: 'du beffroi.' },
		story: [
			'Chaque année, sur la Grand-Place de Mons, saint Georges affronte le dragon : c’est le Lumeçon, un combat chorégraphié, une foule entière qui joue ensemble.',
			'Notre dragon est taillé en facettes, comme un modèle 3D avant ses textures. Il porte ce que nous aimons faire : du jeu, du rythme, et une communauté qui se rassemble autour.'
		],
		detail: 'Emblème low-poly · Acid #C6FF3D · Olive #5B7A00'
	}
};
