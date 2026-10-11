<script lang="ts">
	import { page } from '$app/state';
	import Logo from '#lib/components/brand/Logo.svelte';
	import { reveal } from '#lib/motion/actions.ts';
	import { site } from '#lib/sites/config.ts';

	interface Copy {
		label: string;
		before: string;
		accent: string;
		after: string;
		lead: string;
		retry: boolean;
	}

	const copies: Record<number, Copy> = {
		404: {
			label: 'Page introuvable',
			before: 'Cette page',
			accent: 'n’existe',
			after: 'pas.',
			lead: 'Le lien est peut-être ancien, ou l’adresse a été mal saisie. Le reste de la maison vous attend.',
			retry: false
		},
		503: {
			label: 'Service indisponible',
			before: 'Nous revenons',
			accent: 'bientôt',
			after: '.',
			lead: 'Le site est momentanément indisponible. Il revient dans quelques instants.',
			retry: true
		}
	};

	const fallback: Copy = {
		label: 'Erreur',
		before: 'Un raté',
		accent: 'passager',
		after: '.',
		lead: 'Quelque chose s’est mal passé de notre côté. Réessayez dans un instant.',
		retry: true
	};

	const clientError: Copy = {
		label: 'Demande impossible',
		before: 'Cette demande',
		accent: 'n’aboutit',
		after: 'pas.',
		lead: 'L’adresse ou la demande n’est pas valide. Repartez de l’accueil.',
		retry: false
	};

	const status = $derived(page.status);
	const copy = $derived(copies[status] ?? (status < 500 ? clientError : fallback));
</script>

<svelte:head>
	<title>{copy.label} — {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section
	class="relative isolate flex min-h-[100svh] items-center overflow-clip pt-40 pb-24 md:pt-48"
	aria-labelledby="error-title"
>
	<p
		class="pointer-events-none absolute -right-[0.04em] -bottom-[0.12em] -z-10 font-display text-[clamp(10rem,38vw,40rem)] leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-graphite italic select-none"
		aria-hidden="true"
	>
		{status}
	</p>

	<div class="grid-cardor w-full gap-y-10">
		<div class="col-span-4 flex items-center gap-4 md:col-span-8 lg:col-span-12">
			<Logo name={site.emblem} class="h-10 w-auto" />
			<p class="label text-ash">
				<span class="text-signal">[{status}]</span> // {copy.label}
			</p>
		</div>

		<h1
			id="error-title"
			class="col-span-4 font-display text-display md:col-span-8 lg:col-span-10"
			use:reveal={{ type: 'chars', start: false, delay: 0.2 }}
		>
			{copy.before} <em class="text-signal">{copy.accent}</em>{copy.after === '.'
				? '.'
				: ` ${copy.after}`}
		</h1>

		<p
			class="col-span-4 max-w-[48ch] text-lead text-ash md:col-span-6"
			use:reveal={{ start: false, delay: 0.5 }}
		>
			{copy.lead}
		</p>

		<div class="col-span-4 flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-8">
			{#if copy.retry}
				<button
					type="button"
					onclick={() => location.reload()}
					class="inline-flex min-h-13 items-center gap-3 rounded-full bg-bone px-7 font-medium text-void transition-colors duration-500 hover:bg-signal focus-visible:bg-signal active:scale-[0.97]"
				>
					Réessayer <span aria-hidden="true">↻</span>
				</button>
			{/if}
			<a
				href="/"
				data-sveltekit-reload
				class={copy.retry
					? 'inline-flex min-h-11 items-center underline decoration-smoke decoration-1 underline-offset-8 transition-colors hover:decoration-signal'
					: 'inline-flex min-h-13 items-center gap-3 rounded-full bg-bone px-7 font-medium text-void transition-colors duration-500 hover:bg-signal focus-visible:bg-signal active:scale-[0.97]'}
			>
				Retour à l’accueil <span aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</section>
