<script lang="ts">
	import { onMount } from 'svelte';
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { reveal } from '#lib/motion/actions.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { onFirstView, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import ChoiceGroup from './ChoiceGroup.svelte';
	import { crisp } from './crisp.ts';
	import { copyText } from './copy.ts';
	import {
		categoriesOf,
		codepoint,
		glyphName,
		inCategory,
		isBlank,
		isPua,
		manifest,
		pixelVars,
		styleName
	} from './specimen.ts';
	import type { Glyph } from './types.ts';

	let { styleId = $bindable() }: { styleId: string } = $props();

	const style = $derived(manifest.styles.find((s) => s.id === styleId) ?? manifest.styles[0]);
	const categories = $derived(categoriesOf(style));
	const labels = $derived(new Map(manifest.categories.map((c) => [c.id, c.label])));

	let cat = $state('all');
	const glyphs = $derived(style.glyphs.filter((g) => inCategory(g, cat)));

	/** Cells are 76 px wide (4 per row at 360 px); a glyph wider than a cell spans two. */
	const CELL_K = 4;
	const wide = (g: Glyph) => g.advance * CELL_K > 60;

	let activeCp = $state(65);
	const active = $derived(
		style.glyphs.find((g) => g.cp === activeCp) ?? style.glyphs.find((g) => !isBlank(g))!
	);
	/** Inspector scale: as large as fits 240 px, between ×4 and ×16. */
	const bigK = $derived(Math.max(4, Math.min(16, Math.floor(240 / Math.max(active.advance, 1)))));

	let message = $state('');
	let copied = $state<number | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy(g: Glyph) {
		activeCp = g.cp;
		const ok = await copyText(g.char);
		const what = isPua(g.cp) || isBlank(g) ? (g.label ?? g.name) : `« ${g.char} »`;
		message = ok
			? `${what} (${codepoint(g.cp)}) copié dans le presse-papiers.`
			: `Copie impossible : ${what}, ${codepoint(g.cp)}.`;
		copied = ok ? g.cp : null;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = null), 1200);
	}

	let list = $state<HTMLElement>();

	// Entrance: cells are printed in reading order, clip only (no transform under use:crisp).
	onMount(() => {
		if (!list) return;
		const node = list;
		let tween: gsap.core.Tween | null = null;
		const stop = onFirstView(node, () => {
			const cells = node.querySelectorAll('[data-cell]');
			tween = prefersReducedMotion()
				? gsap.fromTo(cells, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
				: gsap.fromTo(
						cells,
						{ clipPath: 'inset(100% 0% 0% 0%)' },
						{
							clipPath: 'inset(0% 0% 0% 0%)',
							duration: 0.45,
							ease: 'steps(4)',
							stagger: { amount: 0.9 },
							clearProps: 'clipPath'
						}
					);
		});
		return () => {
			stop();
			tween?.revert();
			clearTimeout(timer);
		};
	});
</script>

<section id="glyphes" class="relative section-y" aria-labelledby="glyphes-title">
	<SectionHead
		index="02"
		label="Glyphes"
		title={{
			before: 'Les',
			em: `${style.glyphs.length} glyphes.`
		}}
		id="glyphes-title"
	/>

	<div class="grid-cardor mt-12 gap-y-10 md:mt-16">
		<p
			class="col-span-4 max-w-[56ch] text-lead text-ash md:col-span-6 lg:col-start-4"
			use:reveal={{ delay: 0.1 }}
		>
			Latin de base, français complet, ponctuation, symboles de jeu et emblèmes de la maison.
			Survolez un glyphe pour le détailler, cliquez pour le copier.
		</p>

		<div
			class="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-12"
			use:reveal={{ type: 'block', delay: 0.15 }}
		>
			{#if manifest.styles.length > 1}
				<ChoiceGroup
					legend="Style"
					name="glyphes-style"
					options={manifest.styles.map((s) => ({ value: s.id, label: s.style }))}
					bind:value={styleId}
				/>
			{/if}
			<ChoiceGroup
				legend="Catégorie"
				name="glyphes-categorie"
				options={[
					{ value: 'all', label: 'Tout', hint: String(style.glyphs.length) },
					...categories.map((c) => ({ value: c.id, label: c.label, hint: String(c.count) }))
				]}
				bind:value={cat}
			/>
		</div>

		<!-- Inspector: details of the glyph under the pointer or the keyboard focus. -->
		<aside
			class="inspector col-span-4 min-w-0 self-start md:col-span-8 lg:sticky lg:top-28 lg:col-span-4"
			aria-label="Détail du glyphe"
		>
			<div class="big" use:crisp>
				{#if isBlank(active)}
					<span
						class="blank"
						style="width: {active.advance * bigK}px; height: {style.metrics.cap * bigK}px"
					></span>
				{:else}
					<span class="pixel on-grid" style={pixelVars(style, bigK)} aria-hidden="true"
						>{active.char}</span
					>
				{/if}
			</div>
			<dl class="facts">
				<div>
					<dt>Code</dt>
					<dd class="text-signal">{codepoint(active.cp)}</dd>
				</div>
				<div>
					<dt>Nom</dt>
					<dd>{active.name}</dd>
				</div>
				<div class="col-span-2">
					<dt>Libellé</dt>
					<dd>{active.label ?? '—'}</dd>
				</div>
				<div>
					<dt>Catégorie</dt>
					<dd>{(active.cat && labels.get(active.cat)) || 'Autres'}</dd>
				</div>
				<div>
					<dt>Chasse · encre</dt>
					<dd>{active.advance} · {active.width} px</dd>
				</div>
			</dl>
			<p class="border-t border-smoke px-5 py-3 label text-ash">
				{styleName(style)} · clic ou Entrée = copier
			</p>
		</aside>

		<div class="col-span-4 min-w-0 md:col-span-8 lg:col-span-8">
			<p id="glyphes-aide" class="sr-only">Activer un glyphe copie le caractère.</p>
			<ul
				bind:this={list}
				class="cells"
				style={pixelVars(style, CELL_K)}
				aria-label="{glyphs.length} glyphes"
				use:crisp
			>
				{#each glyphs as g (g.cp)}
					<li class={[wide(g) && 'wide']} data-cell>
						<button
							type="button"
							class={['cell', copied === g.cp && 'is-copied', activeCp === g.cp && 'is-active']}
							aria-label="{glyphName(g)}, {codepoint(g.cp)}"
							aria-describedby="glyphes-aide"
							data-cursor="Copier"
							onpointerenter={() => (activeCp = g.cp)}
							onfocus={() => (activeCp = g.cp)}
							onclick={() => copy(g)}
						>
							<span class="glyph" aria-hidden="true">
								{#if isBlank(g)}
									<span
										class="blank"
										style="width: {g.advance * CELL_K}px; height: {style.metrics.cap * CELL_K}px"
									></span>
								{:else}
									<span class="pixel">{g.char}</span>
								{/if}
							</span>
							<span class="cp" aria-hidden="true">{codepoint(g.cp)}</span>
						</button>
					</li>
				{/each}
			</ul>
			<p class="mt-6 min-h-6 text-sm text-ash" role="status" aria-live="polite">{message}</p>
		</div>
	</div>
</section>

<style>
	.inspector {
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
	}
	.big {
		display: grid;
		place-items: center;
		height: 11rem;
		overflow: clip;
		color: var(--color-bone);
	}
	@media (width >= 48rem) {
		.big {
			height: 14rem;
		}
	}
	/* The glyph's own line box, one cell per font pixel. */
	.on-grid {
		display: block;
		background-image:
			linear-gradient(to right, var(--color-graphite) 1px, transparent 1px),
			linear-gradient(to bottom, var(--color-graphite) 1px, transparent 1px);
		background-size: var(--pixel-px) var(--pixel-px);
		box-shadow: 0 0 0 1px var(--color-smoke);
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem 1.5rem;
		border-top: 1px solid var(--color-smoke);
		padding: 1.25rem;
	}
	.facts dt {
		font-family: var(--font-mono);
		font-size: var(--text-micro);
		letter-spacing: var(--text-micro--letter-spacing);
		text-transform: uppercase;
		color: var(--color-ash);
	}
	.facts dd {
		margin-top: 0.25rem;
		font-family: var(--font-mono);
		overflow-wrap: anywhere;
	}

	.cells {
		display: grid;
		grid-template-columns: repeat(auto-fill, 76px);
		grid-auto-flow: dense;
		gap: 8px;
	}
	.cells .wide {
		grid-column: span 2;
	}
	.cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 88px;
		padding: 10px 0 6px;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		color: var(--color-bone);
		transition:
			border-color 0.2s var(--ease-cardor-out),
			background-color 0.2s var(--ease-cardor-out),
			color 0.2s var(--ease-cardor-out);
	}
	.cell:hover,
	.cell.is-active {
		border-color: var(--color-ash);
	}
	.cell:focus-visible {
		outline-offset: 2px;
	}
	.cell.is-copied {
		border-color: var(--color-signal);
		color: var(--color-signal);
	}
	.cell:active {
		background: var(--color-graphite);
	}
	.glyph {
		display: grid;
		place-items: center;
		height: 40px;
	}
	.blank {
		display: block;
		outline: 1px dashed var(--color-ash);
		outline-offset: -1px;
	}
	.cp {
		font-family: var(--font-mono);
		font-size: var(--text-micro);
		letter-spacing: 0.04em;
		color: var(--color-ash);
	}
	.cell:hover .cp,
	.cell:focus-visible .cp,
	.cell.is-copied .cp {
		color: var(--color-signal);
	}
</style>
