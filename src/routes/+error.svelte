<script lang="ts">
	import { page } from '$app/state';
	import { site } from '#lib/sites/config.ts';
</script>

<svelte:head>
	<title>{page.status} — {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="grid min-h-svh place-items-center gutter-x" aria-labelledby="error-title">
	<div class="max-w-[40ch] text-center">
		<p class="label text-signal">Erreur {page.status}</p>
		<h1 id="error-title" class="mt-4 font-display text-display">
			Ce monde <em class="text-signal">n’existe pas</em>.
		</h1>
		<p class="mt-6 text-ash">{page.error?.message ?? 'Page introuvable'}</p>
		<a href="/" class="mt-10 inline-block label text-bone underline underline-offset-4"
			>Retour à l’accueil</a
		>
	</div>
</section>
