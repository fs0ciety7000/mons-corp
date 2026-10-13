<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import Logo from '#lib/components/brand/Logo.svelte';
	import AppTile from './AppTile.svelte';
	import {
		catalog,
		kindLabels,
		searchText,
		studios,
		type AppKind,
		type Studio
	} from './catalog.ts';
	import { status, watchStatus } from './status.svelte.ts';
	import { divisions } from '#lib/data/divisions.ts';
	import { siteUrl } from '#lib/sites/config.ts';
	import { core } from '#lib/state/core.svelte.ts';
	import { gsap, SplitText } from '#lib/motion/gsap.ts';
	import { duration, ease, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import { jsonLd } from '#lib/seo/seo.ts';
	import { reveal } from '#lib/motion/actions.ts';

	const division = (id: Studio) => divisions.find((d) => d.id === id)!;

	// --- Filters, search, view ---------------------------------------------------------------
	type StudioFilter = 'tous' | Studio;
	let studio = $state<StudioFilter>('tous');
	let kind = $state<'tous' | AppKind>('tous');
	let query = $state('');
	let view = $state<'tuiles' | 'dock'>('tuiles');
	let searchEl: HTMLInputElement;

	const fold = (s: string) =>
		s
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase()
			.trim();
	const index = catalog.map((a) => ({ app: a, text: searchText(a) }));
	const words = $derived(fold(query).split(/\s+/).filter(Boolean));
	const matches = $derived(
		index
			.filter(
				({ app, text }) =>
					(studio === 'tous' || app.studio === studio) &&
					(kind === 'tous' || app.kind === kind) &&
					words.every((w) => text.includes(w))
			)
			.map(({ app }) => app)
	);
	const filtering = $derived(studio !== 'tous' || kind !== 'tous' || words.length > 0);

	const kindPlural: Record<AppKind, string> = {
		jeu: 'Jeux',
		app: 'Applications',
		outil: 'Outils métier',
		creation: 'Créations',
		site: 'Sites'
	};
	const kinds = (Object.keys(kindLabels) as AppKind[]).filter((k) =>
		catalog.some((a) => a.kind === k)
	);
	const hits = (text: string) => words.every((w) => text.includes(w));
	const countStudio = (s: StudioFilter) =>
		index.filter(
			({ app, text }) =>
				(s === 'tous' || app.studio === s) && (kind === 'tous' || app.kind === kind) && hits(text)
		).length;
	const countKind = (k: 'tous' | AppKind) =>
		index.filter(
			({ app, text }) =>
				(studio === 'tous' || app.studio === studio) &&
				(k === 'tous' || app.kind === k) &&
				hits(text)
		).length;

	const reset = () => {
		studio = 'tous';
		kind = 'tous';
		query = '';
	};

	// --- Recently opened (per viewer, convenience only) ---------------------------------------
	const RECENT_KEY = 'cardor:apps:recent';
	let recentIds = $state<string[]>([]);
	const recent = $derived(
		recentIds.map((id) => catalog.find((a) => a.id === id)).filter((a) => a !== undefined)
	);
	function opened(id: string) {
		recentIds = [id, ...recentIds.filter((x) => x !== id)].slice(0, 6);
		try {
			localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds));
		} catch {
			/* private mode: recents simply aren't kept */
		}
	}

	// --- Live status ----------------------------------------------------------------------------
	const upCount = $derived(Object.values(status.results).filter((p) => p.up).length);
	let now = $state(Date.now());
	const checkedAgo = $derived(
		status.at === null ? null : Math.max(0, Math.round((now - status.at) / 1000))
	);
	const agoLabel = (s: number) => (s < 60 ? `il y a ${s} s` : `il y a ${Math.round(s / 60)} min`);

	// --- Keyboard: "/" focuses the search, Enter opens the first result, Escape clears ---------
	function onKey(e: KeyboardEvent) {
		const t = e.target as HTMLElement;
		const typing = t.closest('input, textarea, [contenteditable="true"]');
		if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
			e.preventDefault();
			searchEl.focus();
		}
	}
	function onSearchKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			query = '';
		} else if (e.key === 'Enter' && matches[0]) {
			e.preventDefault();
			opened(matches[0].id);
			window.open(matches[0].url, '_blank', 'noopener');
		}
	}

	// --- Motion ---------------------------------------------------------------------------------
	let hero: HTMLElement;
	let title: HTMLElement;
	let timeline: gsap.core.Timeline | null = null;
	const ms = (v: number) => (prefersReducedMotion() ? 0 : v);

	onMount(() => {
		try {
			const saved = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
			if (Array.isArray(saved)) recentIds = saved.filter((x) => typeof x === 'string');
			const v = localStorage.getItem('cardor:apps:view');
			if (v === 'dock' || v === 'tuiles') view = v;
		} catch {
			/* storage unavailable */
		}
		const stopStatus = watchStatus();
		const tick = setInterval(() => (now = Date.now()), 5_000);

		const reduce = prefersReducedMotion();
		const ctx = gsap.context(() => {
			if (reduce) {
				timeline = gsap
					.timeline({ paused: true })
					.fromTo('[data-ahero]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
				return;
			}
			const words = SplitText.create(title, { type: 'words', mask: 'words', aria: 'none' }).words;
			gsap.set('[data-ahero]', { autoAlpha: 1 });
			timeline = gsap
				.timeline({ paused: true, defaults: { ease: ease.out } })
				.from(words, { yPercent: 110, duration: duration.lg, stagger: 0.06 }, 0.3)
				.from('[data-ahero-up]', { autoAlpha: 0, y: 18, duration: duration.md, stagger: 0.08 }, 0.7)
				.from(
					'[data-app]',
					{ autoAlpha: 0, y: 28, duration: duration.md, stagger: { each: 0.05, from: 'start' } },
					0.9
				);
		}, hero.parentElement!);

		return () => {
			stopStatus();
			clearInterval(tick);
			ctx.revert();
		};
	});

	$effect(() => {
		if (core.ready) timeline?.play();
	});

	$effect(() => {
		try {
			localStorage.setItem('cardor:apps:view', view);
		} catch {
			/* storage unavailable */
		}
	});

	// Rich results: the whole catalogue as one ItemList.
	const base = siteUrl('apps');
	const graph = jsonLd({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'CARDOR Apps — tous les projets de CARDOR Media',
		url: `${base}/`,
		isPartOf: { '@id': `${base}/#website` },
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: catalog.length,
			itemListElement: catalog.map((a, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				item: {
					'@type':
						a.kind === 'jeu'
							? 'VideoGame'
							: a.kind === 'creation'
								? 'CreativeWork'
								: 'WebApplication',
					name: a.name,
					description: a.pitch,
					url: a.url,
					image: `${base}${a.cover}`,
					...(a.kind !== 'creation' ? { operatingSystem: a.platforms.join(', ') } : {}),
					creator: {
						'@type': 'Organization',
						name: division(a.studio).name,
						url: siteUrl(a.studio)
					}
				}
			}))
		}
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialised JSON-LD, < escaped -->
	{@html graph}
</svelte:head>

<svelte:window onkeydown={onKey} />

<span id="newtab-hint" hidden>s’ouvre dans un nouvel onglet</span>

<section
	bind:this={hero}
	class="relative pt-20 pb-6 md:pt-32 md:pb-10"
	aria-labelledby="apps-title"
>
	<div class="glow pointer-events-none absolute inset-0" aria-hidden="true"></div>
	<div data-ahero class="invisible relative">
		<div class="flex flex-wrap items-start justify-between gap-4 gutter-x text-ash">
			<p data-ahero-up class="label">[CM—APPS] Le lanceur de la maison</p>
			<p data-ahero-up class="flex items-center gap-2 label">
				{#if status.at !== null}
					<span class="live-dot" aria-hidden="true"></span>
					<span aria-live="polite">{upCount} / {catalog.length} en ligne</span>
					<span>· vérifié {agoLabel(checkedAgo ?? 0)}</span>
				{:else if status.failed}
					État en direct indisponible
				{:else}
					Vérification des services…
				{/if}
			</p>
		</div>

		<div class="mt-6 gutter-x md:mt-14">
			<h1
				id="apps-title"
				bind:this={title}
				class="max-w-[18ch] font-display text-[clamp(2.5rem,5.5vw,6rem)] leading-[0.9] tracking-[-0.03em]"
			>
				Tous nos <em class="text-signal">mondes</em>, à portée de clic.
			</h1>
			<p data-ahero-up class="mt-6 max-w-[52ch] text-lead text-bone/80 max-sm:hidden">
				Les jeux, applications, outils et créations des quatre studios de CARDOR Media. Cherchez,
				filtrez, ouvrez.
			</p>
		</div>
	</div>
</section>

<div class="relative">
	<!-- Toolbar: the search box sticks while the catalogue scrolls. -->
	<div data-ahero-up class="search-bar mt-8 gutter-x md:mt-10">
		<label for="apps-search" class="search group">
			<svg viewBox="0 0 24 24" class="size-5 shrink-0 text-ash" aria-hidden="true"
				><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.6" /><path
					d="m20 20-3.5-3.5"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
				/></svg
			>
			<input
				id="apps-search"
				bind:this={searchEl}
				bind:value={query}
				onkeydown={onSearchKey}
				type="search"
				autocomplete="off"
				spellcheck="false"
				placeholder="Rechercher un jeu, une app, une plateforme…"
				aria-label="Rechercher un projet"
				class="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-ash md:text-xl"
				aria-describedby="apps-search-hint"
			/>
			<kbd class="kbd max-sm:hidden" aria-hidden="true">/</kbd>
		</label>
	</div>
	<div data-ahero-up class="gutter-x">
		<p id="apps-search-hint" class="sr-only">
			Entrée ouvre le premier résultat dans un nouvel onglet, Échap efface la recherche.
		</p>

		<div class="mt-5 flex flex-wrap items-center justify-between gap-4">
			<div class="scroller flex flex-wrap gap-2" role="group" aria-label="Filtrer par studio">
				<button
					type="button"
					class={['chip', studio === 'tous' && 'is-active']}
					aria-pressed={studio === 'tous'}
					onclick={() => (studio = 'tous')}
					>Tous <span class="tabular-nums">{countStudio('tous')}</span></button
				>
				{#each studios as s (s)}
					<button
						type="button"
						class={['chip', studio === s && 'is-active']}
						style:--division={division(s).color}
						aria-pressed={studio === s}
						onclick={() => (studio = studio === s ? 'tous' : s)}
					>
						<span class="chip-dot" aria-hidden="true"></span>{division(s).name}
						<span class="tabular-nums">{countStudio(s)}</span>
					</button>
				{/each}
			</div>
			<div
				class="flex items-center gap-1 rounded-full border border-smoke p-1"
				role="group"
				aria-label="Affichage"
			>
				<button
					type="button"
					class={['seg', view === 'tuiles' && 'is-active']}
					aria-pressed={view === 'tuiles'}
					onclick={() => (view = 'tuiles')}>Tuiles</button
				>
				<button
					type="button"
					class={['seg', view === 'dock' && 'is-active']}
					aria-pressed={view === 'dock'}
					onclick={() => (view = 'dock')}>Icônes</button
				>
			</div>
		</div>
		<div class="scroller mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrer par type">
			<button
				type="button"
				class={['chip chip-sm', kind === 'tous' && 'is-active']}
				aria-pressed={kind === 'tous'}
				onclick={() => (kind = 'tous')}>Tous les types</button
			>
			{#each kinds as k (k)}
				<button
					type="button"
					class={['chip chip-sm', kind === k && 'is-active']}
					aria-pressed={kind === k}
					disabled={countKind(k) === 0}
					onclick={() => (kind = kind === k ? 'tous' : k)}
					>{kindPlural[k]}
					<span class="tabular-nums">{countKind(k)}</span></button
				>
			{/each}
		</div>
	</div>

	<div id="projets" class="relative mt-10 pb-24 md:pb-32">
		<p class="sr-only" aria-live="polite">
			{matches.length} projet{matches.length > 1 ? 's' : ''} affiché{matches.length > 1 ? 's' : ''}
		</p>

		{#if recent.length && !filtering}
			<section class="mb-12 gutter-x" aria-labelledby="recent-title">
				<h2 id="recent-title" class="mb-4 label text-ash">Récemment ouverts</h2>
				<ul class="flex gap-2 overflow-x-auto pb-2">
					{#each recent as a (a.id)}
						<li class="w-28 shrink-0 md:w-32">
							<AppTile
								app={a}
								color={division(a.studio).color}
								probe={status.results[a.id]}
								view="dock"
								onopen={opened}
							/>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if matches.length === 0}
			<div class="gutter-x">
				<div class="border border-dashed border-smoke p-10 text-center md:p-16">
					<p class="font-display text-h2">Aucun monde ne répond à « {query || 'ces filtres'} ».</p>
					<button type="button" class="chip mt-6" onclick={reset}>Tout afficher</button>
				</div>
			</div>
		{/if}

		{#each studios as s (s)}
			{@const d = division(s)}
			{@const items = matches.filter((a) => a.studio === s)}
			{#if items.length || (!filtering && s === 'sound') || (studio === s && !items.length && !words.length && kind === 'tous')}
				<section
					class="studio mt-6 first:mt-0"
					style:--division={d.color}
					aria-labelledby="studio-{s}"
				>
					<header
						class="mb-6 flex items-end justify-between gap-4 border-t border-smoke gutter-x pt-6"
					>
						<div class="flex items-center gap-4">
							<span class="block h-10 w-12 shrink-0 md:h-12 md:w-14">
								<Logo name={d.id} animate="hover" host=".studio" class="size-full" />
							</span>
							<div>
								<h2 id="studio-{s}" class="font-display text-h2 leading-none">{d.name}</h2>
								<p class="mt-1 label text-ash">
									{items.length
										? `${items.length} projet${items.length > 1 ? 's' : ''}`
										: 'Bientôt'} ·
									{d.tagline}
								</p>
							</div>
						</div>
						<a href={d.url} class="studio-link label max-sm:hidden" data-cursor="Visiter"
							>{d.host} ↗</a
						>
					</header>

					{#if items.length}
						<ul
							class={view === 'dock'
								? 'grid grid-cols-3 gap-2 gutter-x sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8'
								: 'grid-cardor gap-y-6'}
						>
							{#each items as a (a.id)}
								<li
									class={view === 'dock' ? '' : 'col-span-4 md:col-span-4 lg:col-span-4'}
									animate:flip={{ duration: ms(450) }}
									in:fade={{ duration: ms(250) }}
								>
									<AppTile
										app={a}
										color={d.color}
										probe={status.results[a.id]}
										{view}
										onopen={opened}
									/>
								</li>
							{/each}
						</ul>
					{:else}
						<div class="gutter-x">
							<a
								href={d.url}
								class="soon group block border border-dashed border-smoke p-8 md:p-10"
							>
								<p class="label text-(--division)">Bientôt</p>
								<p class="mt-3 font-display text-h2">
									Le carillon <em class="text-(--division)">s’accorde</em>.
								</p>
								<p class="mt-3 max-w-[52ch] text-ash">
									Les premières productions de {d.name} rejoindront le lanceur dès leur sortie. En attendant,
									découvrez le studio.
								</p>
								<span class="mt-5 inline-block label text-bone group-hover:text-(--division)"
									>{d.host} ↗</span
								>
							</a>
						</div>
					{/if}
				</section>
			{/if}
		{/each}
	</div>
</div>

<section id="studios" class="border-t border-smoke section-y" aria-labelledby="studios-title">
	<div class="grid-cardor gap-y-8">
		<p class="col-span-4 label text-ash md:col-span-2 lg:col-span-3" use:reveal>[02] — Studios</p>
		<h2
			id="studios-title"
			class="col-span-4 font-display text-display md:col-span-6 lg:col-span-9"
			use:reveal={{ type: 'words' }}
		>
			Quatre studios, <em class="text-signal">un seul noyau</em>.
		</h2>
	</div>
	<ul class="grid-cardor mt-14 gap-y-4">
		{#each divisions as d (d.id)}
			<li class="col-span-4 md:col-span-4 lg:col-span-3" style:--division={d.color}>
				<a href={d.url} class="house group" data-cursor="Visiter">
					<span class="block h-20 w-24 md:h-24 md:w-28">
						<Logo name={d.id} animate="hover" host=".house" class="size-full" />
					</span>
					<span class="mt-8 block font-display text-h1 leading-none">{d.name}</span>
					<span class="mt-3 block text-ash">{d.tagline}</span>
					<span class="mt-auto flex items-center justify-between pt-8 label text-ash">
						<span
							>{catalog.filter((a) => a.studio === d.id).length || 'Bientôt'}{catalog.some(
								(a) => a.studio === d.id
							)
								? ' projets'
								: ''}</span
						>
						<span class="transition-colors group-hover:text-(--division)">{d.host} ↗</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>
	<p class="mt-10 gutter-x label text-ash">
		Une division de <a href={siteUrl('holding')} class="studio-link text-bone">CARDOR Media ↗</a>
	</p>
</section>

<style>
	.glow {
		background: radial-gradient(
			60% 70% at 85% 0%,
			color-mix(in oklab, var(--color-signal) 14%, transparent),
			transparent 70%
		);
	}
	.live-dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--color-bone);
	}
	/* Sticky search: the box stays at hand while the catalogue scrolls (no "/" key on touch). */
	.search-bar {
		position: sticky;
		top: 0;
		z-index: 20;
		padding-block: 0.75rem;
		/* Solid band behind the box so filters never show through while stuck. */
		background: linear-gradient(var(--color-void) 75%, transparent);
	}
	.search-bar .search {
		backdrop-filter: blur(12px);
	}
	@media (max-width: 767px) {
		.scroller {
			flex-wrap: nowrap;
			overflow-x: auto;
			margin-inline: -16px;
			padding-inline: 16px;
			scrollbar-width: none;
		}
		.scroller > * {
			flex: none;
		}
	}
	.search {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		border: 1px solid var(--color-smoke);
		background: color-mix(in oklab, var(--color-void) 90%, transparent);
		border-radius: 999px;
		padding: 0.95rem 1.25rem;
		transition: border-color 0.4s var(--ease-cardor-out);
	}
	.search:focus-within {
		border-color: var(--color-bone);
	}
	.kbd {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-ash);
		border: 1px solid var(--color-smoke);
		border-radius: 0.4rem;
		padding: 0.15rem 0.5rem;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		border: 1px solid var(--color-smoke);
		border-radius: 999px;
		padding: 0.55rem 1rem;
		font-size: 0.9rem;
		color: var(--color-ash);
		transition:
			color 0.3s,
			background-color 0.3s,
			border-color 0.3s;
	}
	.chip-sm {
		min-height: 2.75rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.chip:hover:not(:disabled):not(.is-active) {
		color: var(--color-bone);
		border-color: var(--color-bone);
	}
	.chip:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.chip.is-active {
		background: var(--division, var(--color-bone));
		border-color: var(--division, var(--color-bone));
		color: var(--color-void);
	}
	.chip-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--division);
	}
	.chip-sm.is-active {
		background: var(--color-bone);
		border-color: var(--color-bone);
	}
	.chip.is-active .chip-dot {
		background: var(--color-void);
	}
	.seg {
		min-height: 2.75rem;
		border-radius: 999px;
		padding: 0.35rem 0.9rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ash);
		transition:
			color 0.3s,
			background-color 0.3s;
	}
	.seg.is-active {
		background: var(--color-bone);
		color: var(--color-void);
	}
	.studio-link {
		background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
		transition:
			color 0.3s,
			background-size 0.5s var(--ease-cardor-out);
	}
	.studio-link:hover,
	.studio-link:focus-visible {
		color: var(--division, var(--color-signal));
		background-size: 100% 1px;
	}
	.soon {
		transition: border-color 0.4s;
	}
	.soon:hover,
	.soon:focus-visible {
		border-color: var(--division);
	}
	.house {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 22rem;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		padding: 2rem;
		transition: border-color 0.5s var(--ease-cardor-out);
	}
	.house:hover,
	.house:focus-visible {
		border-color: color-mix(in oklab, var(--division) 55%, var(--color-smoke));
	}
</style>
