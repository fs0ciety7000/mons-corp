<script lang="ts">
	import { onMount } from 'svelte';
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { reveal } from '#lib/motion/actions.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { ease, onFirstView, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import { crisp, wipe } from './crisp.ts';
	import { manifest, NNBSP, pixelVars, pua } from './specimen.ts';

	let { styleId }: { styleId: string } = $props();
	const style = $derived(manifest.styles.find((s) => s.id === styleId) ?? manifest.styles[0]);
	const vars = $derived(pixelVars(style));

	const coin = pua(0xe000);
	const start = pua(0xe001);
	const beffroi = pua(0xe100);
	const singe = pua(0xe102);

	// HUD: fixed-width digits (5 px each) so the score never jitters while it counts.
	const SCORE = 12340;
	const COINS = 12;
	let score = $state(SCORE);
	let coins = $state(COINS);
	const pad = (n: number, len: number) => String(Math.round(n)).padStart(len, '0');

	// Dialogue: French typography — narrow no-break spaces inside « » and before ! ?
	const line = `«${NNBSP}Ça déménage${NNBSP}!${NNBSP}» Où est passée la clé du beffroi${NNBSP}? Il faut sonner midi avant l’été…`;
	const lineText =
		'« Ça déménage ! » Où est passée la clé du beffroi ? Il faut sonner midi avant l’été…';
	const chars = [...line];
	let typed = $state(chars.length);

	let hud = $state<HTMLElement>();
	let dialog = $state<HTMLElement>();
	let typing: gsap.core.Tween | null = null;

	function type() {
		if (prefersReducedMotion()) {
			typed = chars.length;
			return;
		}
		const state = { n: 0 };
		typing?.kill();
		typing = gsap.to(state, {
			n: chars.length,
			duration: chars.length * 0.035,
			ease: 'none',
			onUpdate: () => (typed = Math.floor(state.n))
		});
	}

	// « Appuyez sur Start » blinks only once the title screen is on screen, for 5 s (WCAG 2.2.2).
	let titleFigure = $state<HTMLElement>();
	let titleSeen = $state(false);

	onMount(() => {
		const stopTitle = onFirstView(titleFigure!, () => (titleSeen = true));
		if (prefersReducedMotion()) return stopTitle;
		score = 0;
		coins = 0;
		typed = 0;
		const counter = { s: 0, c: 0 };
		let count: gsap.core.Tween | null = null;
		// Observe the figures: their clip-path entrance hides the screens from IntersectionObserver.
		const stopHud = onFirstView(hud!.closest('figure') ?? hud!, () => {
			count = gsap.to(counter, {
				s: SCORE,
				c: COINS,
				duration: 1.2,
				ease: ease.snap,
				delay: 0.4,
				onUpdate: () => {
					score = counter.s;
					coins = counter.c;
				}
			});
		});
		const stopDialog = onFirstView(dialog!.closest('figure') ?? dialog!, () =>
			gsap.delayedCall(0.9, type)
		);
		return () => {
			stopTitle();
			stopHud();
			stopDialog();
			count?.kill();
			typing?.kill();
			gsap.killTweensOf(type);
		};
	});
</script>

<section id="en-jeu" class="relative section-y" aria-labelledby="en-jeu-title">
	<SectionHead
		index="03"
		label="En jeu"
		title={{ before: 'Prête à', em: 'jouer.' }}
		id="en-jeu-title"
	/>

	<p class="mt-8 max-w-[56ch] gutter-x text-lead text-ash lg:ml-[25%]" use:reveal={{ delay: 0.15 }}>
		HUD, dialogues, écran-titre : trois écrans en HTML et CSS, avec la police seule. Chaque pixel de
		glyphe couvre exactement 2 pixels d’écran sur téléphone, 3 au-delà.
	</p>

	<div class="grid-cardor mt-12 gap-y-8 md:mt-16" style={vars}>
		<!-- HUD -->
		<figure class="col-span-4 min-w-0 md:col-span-8 lg:col-span-7" use:wipe>
			<div
				bind:this={hud}
				class="screen pixel-box hud"
				role="img"
				aria-label="HUD de jeu : 3 vies, {COINS} pièces, score 0{SCORE}, niveau 1-2, temps 299."
				use:crisp
			>
				<div class="pixel row">
					<span class="text-signal">♥♥♥</span>
					<span><span class="text-signal">{coin}</span>×{pad(coins, 2)}</span>
					<span>SCORE {pad(score, 6)}</span>
				</div>
				<div class="field">
					<span class="pixel hero">{singe}</span>
					<span class="pixel coins text-signal">{coin} {coin} {coin}</span>
					<span class="pixel tower">{beffroi}</span>
				</div>
				<div class="pixel row text-ash">
					<span>NIVEAU 1-2</span>
					<span>TEMPS 299</span>
				</div>
			</div>
			<figcaption class="caption">HUD · chiffres à chasse fixe, vies ♥, pièces U+E000</figcaption>
		</figure>

		<!-- Dialogue -->
		<figure
			class="col-span-4 flex min-w-0 flex-col md:col-span-8 lg:col-span-5"
			use:wipe={{ delay: 0.1 }}
		>
			<div class="screen pixel-box dialog-scene">
				<div
					bind:this={dialog}
					class="dialog pixel"
					role="img"
					aria-label="Boîte de dialogue, le Singe : {lineText}"
					use:crisp
				>
					<p class="text-signal">{singe} LE SINGE</p>
					<p class="mt-[calc(4*var(--pixel-px))]">
						<span>{chars.slice(0, typed).join('')}</span><span class="invisible"
							>{chars.slice(typed).join('')}</span
						>
					</p>
					<span class="next text-signal" class:blink={typed >= chars.length}>▼</span>
				</div>
			</div>
			<figcaption class="caption">
				<span>Dialogue · accents, « » et espaces fines</span>
				<button type="button" class="replay" onclick={type}>Rejouer ↻</button>
			</figcaption>
		</figure>

		<!-- Title screen -->
		<figure
			bind:this={titleFigure}
			class="col-span-4 min-w-0 md:col-span-8 lg:col-span-12"
			use:wipe={{ delay: 0.1 }}
		>
			<div
				class="screen pixel-box title-screen"
				role="img"
				aria-label="Écran-titre : Beffroi, le carillon en pixels. Menu : nouvelle partie, continuer, options. Appuyez sur Start. © 2026 CARDOR Media."
			>
				<div class="title-inner" use:crisp>
					<span class="pixel emblem">{beffroi}</span>
					<p class="pixel logo text-signal">BEFFROI</p>
					<p class="pixel">LE CARILLON EN PIXELS</p>
					<ul class="pixel menu">
						<li><span class="text-signal">▶</span>NOUVELLE PARTIE</li>
						<li class="text-ash"><span class="invisible">▶</span>CONTINUER</li>
						<li class="text-ash"><span class="invisible">▶</span>OPTIONS</li>
					</ul>
					<p class="pixel" class:blink={titleSeen}>
						APPUYEZ SUR <span class="text-signal">{start}</span>
					</p>
					<p class="pixel text-ash">© 2026 CARDOR MEDIA</p>
				</div>
			</div>
			<figcaption class="caption">
				Écran-titre · ×6 / ×9 pour le logo, ×2 / ×3 pour le menu
			</figcaption>
		</figure>
	</div>
</section>

<style>
	/* Every demo screen: ×2 on phones, ×3 from 768 px. Borders and gaps in font pixels. */
	.screen {
		--pixel-k: 2;
		position: relative;
		overflow: clip;
		border: 1px solid var(--color-smoke);
		background: var(--color-void);
		color: var(--color-bone);
	}
	@media (width >= 48rem) {
		.screen {
			--pixel-k: 3;
		}
	}
	.caption {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 1.5rem;
		margin-top: 0.75rem;
		font-family: var(--font-mono);
		font-size: var(--text-micro);
		letter-spacing: var(--text-micro--letter-spacing);
		text-transform: uppercase;
		color: var(--color-ash);
	}
	.replay {
		min-height: 2.75rem;
		padding: 0 1rem;
		border: 1px solid var(--color-smoke);
		border-radius: 999px;
		color: var(--color-bone);
		text-transform: uppercase;
		transition: border-color 0.2s var(--ease-cardor-out);
	}
	.replay:hover {
		border-color: var(--color-signal);
	}

	/* HUD */
	.hud {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: calc(6 * var(--pixel-px));
		padding: calc(4 * var(--pixel-px)) calc(6 * var(--pixel-px));
		min-height: calc(90 * var(--pixel-px));
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0 calc(8 * var(--pixel-px));
	}
	.field {
		position: relative;
		flex: 1;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		border-bottom: var(--pixel-px) solid var(--color-ash);
		min-height: calc(40 * var(--pixel-px));
	}
	.hero {
		--pixel-k: 4;
	}
	.coins {
		align-self: center;
	}
	.tower {
		--pixel-k: 6;
	}
	@media (width >= 48rem) {
		.hero {
			--pixel-k: 6;
		}
		.tower {
			--pixel-k: 9;
		}
	}

	/* Dialogue */
	.dialog-scene {
		display: flex;
		flex: 1;
		align-items: flex-end;
		min-height: calc(90 * var(--pixel-px));
		padding: calc(4 * var(--pixel-px));
		background:
			linear-gradient(to bottom, transparent 60%, var(--color-ink) 60%), var(--color-void);
	}
	.dialog {
		position: relative;
		width: 100%;
		padding: calc(5 * var(--pixel-px)) calc(6 * var(--pixel-px)) calc(12 * var(--pixel-px));
		border: var(--pixel-px) solid var(--color-bone);
		outline: var(--pixel-px) solid var(--color-void);
		box-shadow: 0 0 0 calc(2 * var(--pixel-px)) var(--color-smoke);
		background: var(--color-void);
	}
	.next {
		position: absolute;
		right: calc(5 * var(--pixel-px));
		bottom: calc(1 * var(--pixel-px));
	}

	/* Title screen */
	.title-screen {
		display: grid;
		place-items: center;
		padding: calc(10 * var(--pixel-px)) calc(4 * var(--pixel-px));
		background:
			radial-gradient(
				ellipse 60% 70% at 50% 40%,
				color-mix(in oklab, var(--color-signal) 9%, transparent),
				transparent 70%
			),
			var(--color-void);
	}
	.title-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(4 * var(--pixel-px));
		text-align: center;
	}
	.emblem {
		--pixel-k: 6;
	}
	.logo {
		--pixel-k: 6;
		margin-bottom: calc(2 * var(--pixel-px));
	}
	@media (width >= 48rem) {
		.emblem,
		.logo {
			--pixel-k: 9;
		}
	}
	.menu {
		display: grid;
		gap: calc(1 * var(--pixel-px));
		margin-block: calc(6 * var(--pixel-px));
		text-align: left;
	}
	.menu li span {
		margin-right: calc(3 * var(--pixel-px));
	}

	/* 1 Hz, far below the 3 Hz flash limit; ends visible; frozen under reduced motion. */
	.blink {
		/* 5 cycles then steady: no blinking content lasts more than 5 s (WCAG 2.2.2). */
		animation: blink 1s steps(1, end) 5;
	}
	@keyframes blink {
		50% {
			visibility: hidden;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.blink {
			animation: none;
		}
	}
</style>
