<script lang="ts">
	import DivisionHero from '#lib/sites/division/DivisionHero.svelte';
	import Statement from '#lib/sites/division/Statement.svelte';
	import Offer from '#lib/sites/division/Offer.svelte';
	import Method from '#lib/sites/division/Method.svelte';
	import EmblemStory from '#lib/sites/division/EmblemStory.svelte';
	import Sisters from '#lib/sites/division/Sisters.svelte';
	import Marquee from '#lib/components/sections/Marquee.svelte';
	import Platform from './Platform.svelte';
	import { content, platform } from './content.ts';
	import { jsonLd } from '#lib/seo/seo.ts';
	import { siteUrl } from '#lib/sites/config.ts';

	// The reading platform, as a WebApplication published by the house (no Book data: the
	// catalogue is still a demo, cf. cardor-publishing CLAUDE.md §3.12).
	const app = jsonLd({
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Cardormedia Publishing',
		description:
			'Liseuse et atelier d’édition numérique : la liseuse prend l’apparence de chaque livre, la Forge accompagne les auteurs.',
		url: platform.url,
		applicationCategory: 'BookApplication',
		operatingSystem: 'Web',
		inLanguage: 'fr',
		publisher: { '@id': `${siteUrl('publishing')}/#organization` }
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialised JSON-LD, < escaped -->
	{@html app}
</svelte:head>

<DivisionHero hero={content.hero}>
	{#snippet signature()}
		<span class="label text-ash italic">Chaque livre a son propre monde.</span>
	{/snippet}
</DivisionHero>
<Statement index="01" label={content.statement.label} html={content.statement.html} />
<Marquee words={content.marquee} />
<Offer index="02" offer={content.offer} />
<Platform index="03" />
<Method index="04" method={content.method} />
<EmblemStory index="05" emblem={content.emblem} />
<Sisters />
