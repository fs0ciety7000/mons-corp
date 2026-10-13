<script lang="ts">
	import DivisionHero from '#lib/sites/division/DivisionHero.svelte';
	import Statement from '#lib/sites/division/Statement.svelte';
	import Offer from '#lib/sites/division/Offer.svelte';
	import Method from '#lib/sites/division/Method.svelte';
	import EmblemStory from '#lib/sites/division/EmblemStory.svelte';
	import Sisters from '#lib/sites/division/Sisters.svelte';
	import Marquee from '#lib/components/sections/Marquee.svelte';
	import InkTrail from './InkTrail.svelte';
	import Works from './Works.svelte';
	import { content } from './content.ts';
	import { catalog } from '#lib/sites/apps/catalog.ts';
	import { jsonLd } from '#lib/seo/seo.ts';
	import { siteUrl } from '#lib/sites/config.ts';
	import type { PixelFace } from './beffroi8/pixel.ts';

	let { beffroi = null }: { beffroi?: { face: PixelFace; css: string } | null } = $props();

	// Rich results: the atelier's published works, as CreativeWork items.
	const works = jsonLd({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Productions CM Creative Lab',
		itemListElement: catalog
			.filter((a) => a.studio === 'creative')
			.map((a, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				item: {
					'@type': 'CreativeWork',
					name: a.name,
					description: a.pitch,
					url: a.url,
					image: `${siteUrl('creative')}${a.cover}`,
					genre: a.category,
					creator: { '@id': `${siteUrl('creative')}/#organization` }
				}
			}))
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialised JSON-LD, < escaped -->
	{@html works}
</svelte:head>

<InkTrail />
<DivisionHero hero={content.hero}>
	{#snippet signature()}
		<span class="label text-ash italic">Bougez la plume ✎</span>
	{/snippet}
</DivisionHero>
<Statement index="01" label={content.statement.label} html={content.statement.html} />
<Marquee words={content.marquee} />
<Offer index="02" offer={content.offer} />
<Method index="03" method={content.method} />
<EmblemStory index="04" emblem={content.emblem} />
{#if content.soon}<Works index="05" soon={content.soon} {beffroi} />{/if}
<Sisters />
