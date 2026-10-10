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
	import { site } from '#lib/data/site.ts';

	let { children }: LayoutProps = $props();

	onMount(() => startSmoothScroll());
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
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
