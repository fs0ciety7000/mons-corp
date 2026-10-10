<script lang="ts">
	import { SITE, site as current } from '#lib/sites/config.ts';
	import { site } from '#lib/data/site.ts';
	import HoldingHome from '#lib/sites/holding/Home.svelte';
	import InteractiveHome from '#lib/sites/interactive/Home.svelte';
	import SoundHome from '#lib/sites/sound/Home.svelte';
	import CreativeHome from '#lib/sites/creative/Home.svelte';

	const title = `${site.name} — ${current.tagline}`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={site.description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={site.description} />
	<meta property="og:url" content={site.url} />
	<link rel="canonical" href={site.url} />
</svelte:head>

<!-- ADR-008: one route, four sites — the branch is fixed at build time. -->
{#if SITE === 'interactive'}
	<InteractiveHome />
{:else if SITE === 'sound'}
	<SoundHome />
{:else if SITE === 'creative'}
	<CreativeHome />
{:else}
	<HoldingHome />
{/if}
