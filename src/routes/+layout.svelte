<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';
	import Preloader from '#lib/components/layout/Preloader.svelte';
	import Nav from '#lib/components/layout/Nav.svelte';
	import Cursor from '#lib/components/layout/Cursor.svelte';
	import Grain from '#lib/components/layout/Grain.svelte';
	import PageCurtain from '#lib/components/layout/PageCurtain.svelte';
	import Footer from '#lib/components/layout/Footer.svelte';
	import { startSmoothScroll } from '#lib/motion/lenis.ts';
	import { isHolding, SITE } from '#lib/sites/config.ts';
	import { jsonLd, siteGraph } from '#lib/seo/seo.ts';

	const graph = jsonLd(siteGraph());

	let { children }: LayoutProps = $props();

	onMount(() => startSmoothScroll());
</script>

<svelte:head>
	{#if isHolding}
		<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	{/if}
	<link rel="icon" href="/icons/{SITE}-32.png" sizes="32x32" type="image/png" />
	<link rel="apple-touch-icon" href="/icons/{SITE}-180.png" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialised JSON-LD, < escaped -->
	{@html graph}
</svelte:head>

<a
	href="#main"
	class="fixed top-4 left-4 z-[110] -translate-y-24 bg-bone px-4 py-3 label text-void focus:translate-y-0"
	>Aller au contenu</a
>

<Preloader />
<Nav />
<PageCurtain />

<main id="main">
	{@render children()}
</main>

<Footer />
<Grain />
<Cursor />
