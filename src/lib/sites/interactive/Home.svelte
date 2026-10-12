<script lang="ts">
	import DivisionHero from '#lib/sites/division/DivisionHero.svelte';
	import Statement from '#lib/sites/division/Statement.svelte';
	import Offer from '#lib/sites/division/Offer.svelte';
	import Method from '#lib/sites/division/Method.svelte';
	import EmblemStory from '#lib/sites/division/EmblemStory.svelte';
	import Sisters from '#lib/sites/division/Sisters.svelte';
	import Marquee from '#lib/components/sections/Marquee.svelte';
	import Projects from './Projects.svelte';
	import { content } from './content.ts';
	import { projects } from './projects.ts';
	import { jsonLd } from '#lib/seo/seo.ts';
	import { siteUrl } from '#lib/sites/config.ts';

	// Rich results: the studio's published works, as VideoGame / WebApplication items.
	const works = jsonLd({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Projets CM Interactive',
		itemListElement: projects.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			item: {
				'@type': p.kind === 'jeu' ? 'VideoGame' : 'WebApplication',
				name: p.name,
				description: p.pitch,
				url: p.url,
				image: `${siteUrl('interactive')}${p.cover}`,
				applicationCategory:
					p.schema?.category ?? (p.kind === 'jeu' ? 'GameApplication' : 'BusinessApplication'),
				operatingSystem: p.schema?.os ?? 'Web',
				...(p.kind === 'jeu'
					? { gamePlatform: 'Web browser', genre: p.category.split('·')[1]?.trim() }
					: {}),
				creator: { '@id': `${siteUrl('interactive')}/#organization` }
			}
		}))
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialised JSON-LD, < escaped -->
	{@html works}
</svelte:head>

<DivisionHero hero={content.hero}>
	{#snippet signature()}
		<span class="label text-ash">[ PRESS START ]</span>
	{/snippet}
</DivisionHero>
<Statement index="01" label={content.statement.label} html={content.statement.html} />
<Marquee words={content.marquee} />
<Offer index="02" offer={content.offer} />
<Projects index="03" />
<Method index="04" method={content.method} />
<EmblemStory index="05" emblem={content.emblem} />
<Sisters />
