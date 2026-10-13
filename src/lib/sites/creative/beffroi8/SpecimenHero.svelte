<script lang="ts">
	import { onMount } from 'svelte';
	import { core } from '#lib/state/core.svelte.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { duration, ease, prefersReducedMotion, stagger } from '#lib/motion/tokens.ts';
	import { crisp } from './crisp.ts';
	import {
		codepoint,
		isDraft,
		manifest,
		NNBSP,
		pixelVars,
		primary,
		pua,
		styleName
	} from './specimen.ts';

	const m = primary.metrics;
	const title = 'Beffroi 8';
	/** Title width in font pixels: the wipe moves one font-pixel column per step. */
	const columns = [...title].reduce(
		(w, ch) => w + (primary.glyphs.find((g) => g.char === ch)?.advance ?? primary.grid),
		0
	);
	const glyphCount = new Set(manifest.styles.flatMap((s) => s.glyphs.map((g) => g.cp))).size;
	const sample = `Ça déménage${NNBSP}! 0123456789 ♥ ★ ${pua(0xe000)} ${pua(0xe100)}`;
	const sampleText = 'Ça déménage ! 0123456789, cœur, étoile, pièce et beffroi.';

	/** Vertical guides of the anatomy plate, in font pixels from the top of the line box. */
	const guides = [
		{ name: 'Asc.', y: m.top - m.ascent, value: m.ascent },
		{ name: 'Cap.', y: m.top - m.cap, value: m.cap },
		{ name: 'x', y: m.top - m.xHeight, value: m.xHeight },
		{ name: 'Base', y: m.top, value: 0 },
		{ name: 'Desc.', y: m.top + m.descent, value: m.descent }
	];

	const facts = [
		{ k: 'Grille', v: `${primary.grid} px` },
		{ k: 'Capitale · x', v: `${m.cap} · ${m.xHeight} px` },
		{ k: 'Asc. · desc.', v: `${m.ascent} · ${m.descent} px` },
		{ k: 'Interligne', v: `${m.lineHeight} px` },
		{ k: 'Glyphes', v: String(glyphCount) },
		{
			k: manifest.styles.length > 1 ? 'Styles' : 'Style',
			v: manifest.styles.map((s) => s.style).join(' · ')
		}
	];

	let root = $state<HTMLElement>();
	let timeline: gsap.core.Timeline | null = null;

	// Motion report §5, scaled down for an inner page: the title is « printed » column by
	// column (steps = font pixels), then the meta lines and the anatomy plate enter.
	onMount(() => {
		const ctx = gsap.context(() => {
			if (prefersReducedMotion()) {
				timeline = gsap
					.timeline({ paused: true })
					.fromTo('[data-hero]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
				return;
			}
			timeline = gsap
				.timeline({ paused: true, defaults: { ease: ease.out } })
				.from('[data-hero-label]', { yPercent: 110, duration: duration.md }, 0)
				.fromTo(
					'[data-hero-title]',
					{ clipPath: 'inset(0% 100% 0% 0%)' },
					{ clipPath: 'inset(0% 0% 0% 0%)', duration: duration.lg, ease: `steps(${columns})` },
					0.15
				)
				.from(
					'[data-hero-line]',
					{ yPercent: 110, duration: duration.lg, stagger: stagger.lines },
					0.5
				)
				.fromTo(
					'[data-hero-plate]',
					{ clipPath: 'inset(0% 0% 100% 0%)' },
					{ clipPath: 'inset(0% 0% 0% 0%)', duration: duration.lg, ease: ease.inOut },
					0.6
				)
				.from(
					'[data-hero-guide]',
					{ scaleX: 0, transformOrigin: '0% 50%', duration: duration.md, stagger: stagger.lines },
					0.9
				)
				.from(
					'[data-hero-fact]',
					{ yPercent: 100, autoAlpha: 0, duration: duration.md, stagger: stagger.words },
					0.9
				);
		}, root);
		return () => {
			timeline = null;
			ctx.revert();
		};
	});

	// Plays once the preloader has lifted (immediately after a client-side navigation).
	$effect(() => {
		if (core.ready) timeline?.play();
	});
</script>

<section bind:this={root} class="pt-36 pb-16 md:pt-52 md:pb-24" aria-labelledby="specimen-title">
	<div class="grid-cardor gap-y-10">
		<div
			class="col-span-4 flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-8 lg:col-span-12"
		>
			<p class="overflow-clip label text-ash">
				<span data-hero data-hero-label class="block"
					>[Police pixel] — CM Creative Lab × CM Interactive</span
				>
			</p>
			{#if isDraft}
				<p class="overflow-clip label">
					<span data-hero data-hero-label class="flex items-center gap-2 text-signal">
						<span class="draft-dot" aria-hidden="true"></span>
						v{manifest.version} · en cours de dessin
					</span>
				</p>
			{/if}
		</div>

		<h1
			id="specimen-title"
			class="pixel title col-span-4 min-w-0 text-bone md:col-span-8 lg:col-span-12"
			style={pixelVars(primary)}
			data-hero
			data-hero-title
			use:crisp
		>
			{title}
		</h1>

		<div class="col-span-4 min-w-0 md:col-span-8 lg:col-span-7">
			<p class="font-display text-h2">
				<span class="block overflow-clip pb-[0.08em]"
					><span data-hero data-hero-line class="block"
						>Le carillon <em class="text-signal">en pixels</em>.</span
					></span
				>
			</p>
			<div class="mt-8 max-w-[56ch] space-y-4 text-lead text-ash">
				<p class="overflow-clip">
					<span data-hero data-hero-line class="block">
						La police pixel maison de CARDOR Media, dessinée par CM Creative Lab pour les jeux rétro
						de CM Interactive.
					</span>
				</p>
				<p class="overflow-clip">
					<span data-hero data-hero-line class="block">
						Lisible à ×1, nette à chaque multiple entier, française jusqu’à l’espace fine.
					</span>
				</p>
			</div>

			<p class="mt-10 flex flex-wrap gap-3">
				<a href="#essai" class="cta cta-primary" data-cursor="Écrire">Essayer la police</a>
				<a href="#telecharger" class="cta" data-cursor="Télécharger">Télécharger ↓</a>
			</p>
		</div>

		<!-- Anatomy plate: one glyph line on its pixel grid, with the style's vertical metrics. -->
		<figure class="col-span-4 min-w-0 md:col-span-8 lg:col-span-5 lg:self-end">
			<div class="plate" data-hero data-hero-plate>
				<div
					class="plate-inner pixel-box"
					style="{pixelVars(primary)}; --rows: {m.lineHeight}"
					use:crisp
				>
					{#each guides as g, i (g.name)}
						<div
							class={['guide', g.value === 0 && 'is-base', i % 2 ? 'is-left' : 'is-right']}
							style="top: calc({g.y} * var(--pixel-px))"
							data-hero
							data-hero-guide
						>
							<span class="guide-label">{g.name}{g.value ? ` · ${g.value}` : ''}</span>
						</div>
					{/each}
					<p class="pixel relative text-bone" aria-hidden="true">Hxgé{pua(0xe100)}</p>
				</div>
			</div>
			<figcaption class="mt-4 label text-ash">
				{styleName(primary)} · grille de {primary.grid} px · 1 px = {primary.pxUnits} unités ·
				{codepoint(0xe100)} le Beffroi
			</figcaption>
		</figure>

		<dl
			class="col-span-4 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-smoke pt-8 md:col-span-8 md:grid-cols-3 lg:col-span-12 lg:grid-cols-6"
		>
			{#each facts as f (f.k)}
				<div class="overflow-clip">
					<dt class="label text-ash" data-hero data-hero-fact>{f.k}</dt>
					<dd class="mt-2 font-display text-h2 leading-none" data-hero data-hero-fact>{f.v}</dd>
				</div>
			{/each}
		</dl>

		<p class="col-span-4 min-w-0 overflow-clip md:col-span-8 lg:col-span-12">
			<span class="sr-only">Exemple : {sampleText}</span>
			<span
				class="pixel block text-signal"
				style={pixelVars(primary, 2)}
				aria-hidden="true"
				use:crisp>{sample}</span
			>
		</p>
	</div>
</section>

<style>
	/* Title: a whole multiple of the grid at every breakpoint (×7 → ×14 → ×20 → ×28). */
	.title {
		--pixel-k: 7;
		overflow-wrap: anywhere;
	}
	@media (width >= 48rem) {
		.title {
			--pixel-k: 14;
		}
	}
	@media (width >= 80rem) {
		.title {
			--pixel-k: 20;
		}
	}
	@media (width >= 120rem) {
		.title {
			--pixel-k: 28;
		}
	}

	.draft-dot {
		width: 0.5rem;
		height: 0.5rem;
		background: currentColor;
	}

	.plate {
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		--plate-x: 1.5rem;
		padding: 2rem var(--plate-x);
		overflow: clip;
	}
	@media (width >= 48rem) {
		.plate {
			--plate-x: 5rem;
		}
	}
	.plate-inner {
		--pixel-k: 8;
		position: relative;
		width: fit-content;
		margin-inline: auto;
		/* The pixel grid itself, one cell per font pixel. */
		background-image:
			linear-gradient(to right, var(--color-graphite) 1px, transparent 1px),
			linear-gradient(to bottom, var(--color-graphite) 1px, transparent 1px);
		background-size: var(--pixel-px) var(--pixel-px);
		padding-inline: var(--pixel-px);
	}
	@media (width >= 48rem) {
		.plate-inner {
			--pixel-k: 12;
		}
	}
	@media (width >= 80rem) {
		.plate-inner {
			--pixel-k: 8;
		}
	}
	@media (width >= 120rem) {
		.plate-inner {
			--pixel-k: 14;
		}
	}
	.guide {
		position: absolute;
		left: calc(-1 * var(--plate-x));
		right: calc(-1 * var(--plate-x));
		height: 1px;
		background: color-mix(in oklab, var(--color-signal) 55%, transparent);
	}
	.guide.is-base {
		background: var(--color-signal);
	}
	.guide-label {
		position: absolute;
		bottom: 3px;
		font-family: var(--font-mono);
		font-size: var(--text-micro);
		line-height: 1;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-signal);
		white-space: nowrap;
		display: none;
	}
	.is-right .guide-label {
		right: 0.75rem;
	}
	.is-left .guide-label {
		left: 0.75rem;
	}
	@media (width >= 48rem) {
		.guide-label {
			display: block;
		}
	}

	.cta {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0 1.5rem;
		border: 1px solid var(--color-smoke);
		border-radius: 999px;
		color: var(--color-bone);
		transition:
			border-color 0.2s var(--ease-cardor-out),
			background-color 0.2s var(--ease-cardor-out),
			color 0.2s var(--ease-cardor-out);
	}
	.cta:hover {
		border-color: var(--color-bone);
	}
	.cta-primary {
		background: var(--color-bone);
		border-color: var(--color-bone);
		color: var(--color-void);
	}
	.cta-primary:hover {
		background: var(--color-signal);
		border-color: var(--color-signal);
	}
	.cta:active {
		scale: 0.97;
	}
</style>
