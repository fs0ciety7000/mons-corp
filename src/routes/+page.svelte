<script lang="ts">
	import Hero from '#lib/components/hero/Hero.svelte';
	import Manifesto from '#lib/components/sections/Manifesto.svelte';
	import Marquee from '#lib/components/sections/Marquee.svelte';
	import Divisions from '#lib/components/sections/Divisions.svelte';
	import { site } from '#lib/data/site.ts';
</script>

<svelte:head>
	<title>{site.name} — Nous fabriquons des mondes</title>
	<meta name="description" content={site.description} />
	<meta property="og:title" content="{site.name} — Nous fabriquons des mondes" />
	<meta property="og:description" content={site.description} />
	<meta property="og:url" content={site.url} />
	<link rel="canonical" href={site.url} />
</svelte:head>

<Hero />
<Manifesto />
<Marquee />
<Divisions />
