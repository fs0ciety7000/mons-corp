<script lang="ts">
	import { SITE } from '#lib/sites/config.ts';
	import Seo from '#lib/components/seo/Seo.svelte';
	import HoldingHome from '#lib/sites/holding/Home.svelte';
	import InteractiveHome from '#lib/sites/interactive/Home.svelte';
	import SoundHome from '#lib/sites/sound/Home.svelte';
	import CreativeHome from '#lib/sites/creative/Home.svelte';
</script>

<Seo page="home" />

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
