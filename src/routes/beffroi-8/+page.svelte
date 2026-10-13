<script lang="ts">
	import '#lib/sites/creative/beffroi8/pixel.css';
	import Seo from '#lib/components/seo/Seo.svelte';
	import SpecimenHero from '#lib/sites/creative/beffroi8/SpecimenHero.svelte';
	import Playground from '#lib/sites/creative/beffroi8/Playground.svelte';
	import GlyphGrid from '#lib/sites/creative/beffroi8/GlyphGrid.svelte';
	import GameDemos from '#lib/sites/creative/beffroi8/GameDemos.svelte';
	import Downloads from '#lib/sites/creative/beffroi8/Downloads.svelte';
	import {
		asset,
		fontFaces,
		licenseOf,
		manifest,
		primary,
		zipPath
	} from '#lib/sites/creative/beffroi8/specimen.ts';
	import { siteUrl } from '#lib/sites/config.ts';

	/** One style drives the tester, the glyph grid and the demos. */
	let styleId = $state(primary.id);

	const base = siteUrl('creative');
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'Beffroi 8',
		alternateName: manifest.styles.map((s) => `${s.family} ${s.style}`),
		genre: 'Police de caractères pixel',
		description:
			'Police pixel maison de CARDOR Media, dessinée par CM Creative Lab pour les jeux rétro de CM Interactive.',
		url: `${base}/beffroi-8`,
		version: manifest.version,
		inLanguage: 'fr',
		creator: { '@id': `${base}/#organization` },
		copyrightHolder: { '@id': `${siteUrl('holding')}/#organization` },
		copyrightYear: 2026,
		usageInfo: licenseOf(manifest.license).title,
		encoding: manifest.styles.flatMap((s) =>
			(['woff2', 'ttf', 'otf'] as const).map((f) => ({
				'@type': 'MediaObject',
				name: `${s.family} ${s.style} (${f.toUpperCase()})`,
				contentUrl: `${base}${asset(s.files[f])}`,
				encodingFormat: `font/${f}`
			}))
		),
		archivedAt: `${base}${asset(zipPath)}`
	};
</script>

<Seo page="beffroi-8" {schema} />

<svelte:head>
	<!-- Only the style shown first is preloaded (LCP: the pixel title). -->
	<link
		rel="preload"
		href={asset(primary.files.woff2)}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- @font-face built from the synced manifest -->
	{@html `<style>${fontFaces}</style>`}
</svelte:head>

<SpecimenHero />
<Playground bind:styleId />
<GlyphGrid bind:styleId />
<GameDemos {styleId} />
<Downloads />
