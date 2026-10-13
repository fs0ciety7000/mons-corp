<script lang="ts">
	import { onMount, tick } from 'svelte';
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { reveal } from '#lib/motion/actions.ts';
	import ChoiceGroup from './ChoiceGroup.svelte';
	import BitmapPreview from './BitmapPreview.svelte';
	import { crisp, wipe } from './crisp.ts';
	import {
		codepoint,
		manifest,
		missingChars,
		NNBSP,
		pixelVars,
		pua,
		styleName
	} from './specimen.ts';

	let { styleId = $bindable() }: { styleId: string } = $props();

	const style = $derived(manifest.styles.find((s) => s.id === styleId) ?? manifest.styles[0]);

	let text = $state(
		`Ça déménage${NNBSP}! Le beffroi sonne midi.\nSCORE 012340 ♥♥♥ ${pua(0xe000)}×12`
	);

	/** Default size: the largest crisp size up to 32 px (×4 on the 8 px grid). */
	const defaultSize = (sizes: number[]) => [...sizes].reverse().find((n) => n <= 32) ?? sizes[0];
	let size = $state(defaultSize(manifest.styles[0].crispSizes));
	// A new style may not share the sizes of the previous one: fall back to its default.
	$effect(() => {
		if (!style.crispSizes.includes(size)) size = defaultSize(style.crispSizes);
	});

	/** Pairs of tokens only: void, bone and the Creative Lab amber (all ≥ 11:1). */
	const themes = [
		{ value: 'bone-void', label: 'Bone sur void', fg: 'bone', bg: 'void' },
		{ value: 'amber-void', label: 'Amber sur void', fg: 'creative', bg: 'void' },
		{ value: 'void-amber', label: 'Void sur amber', fg: 'void', bg: 'creative' },
		{ value: 'void-bone', label: 'Void sur bone', fg: 'void', bg: 'bone' }
	] as const;
	type ThemeId = (typeof themes)[number]['value'];
	let themeId = $state<ThemeId>('bone-void');
	const theme = $derived(themes.find((t) => t.value === themeId)!);

	// The canvas needs resolved colours: read them from the design tokens once mounted.
	let tokens = $state<Record<string, string>>({});
	onMount(() => {
		const css = getComputedStyle(document.documentElement);
		tokens = Object.fromEntries(
			['void', 'bone', 'creative'].map((t) => [t, css.getPropertyValue(`--color-${t}`).trim()])
		);
	});

	const k = $derived(size / style.grid);
	const missing = $derived(missingChars(style, text));
	const insert = [
		{ char: NNBSP, label: 'Espace fine insécable' },
		{ char: '«', label: 'Guillemet ouvrant' },
		{ char: '»', label: 'Guillemet fermant' },
		{ char: '♥', label: 'Cœur' },
		{ char: pua(0xe000), label: 'Pièce' },
		{ char: pua(0xe100), label: 'Beffroi' }
	];
	let field = $state<HTMLTextAreaElement>();

	async function add(ch: string) {
		if (!field) return;
		const { selectionStart: a, selectionEnd: b } = field;
		text = text.slice(0, a) + ch + text.slice(b);
		await tick();
		field.focus();
		field.setSelectionRange(a + ch.length, a + ch.length);
	}
</script>

<section id="essai" class="relative section-y" aria-labelledby="essai-title">
	<SectionHead
		index="01"
		label="Essai"
		title={{ before: 'Tapez,', em: 'ça sonne.' }}
		id="essai-title"
	/>

	<div class="grid-cardor mt-12 gap-y-12 md:mt-16">
		<form
			class="col-span-4 min-w-0 space-y-8 md:col-span-8 lg:col-span-4"
			onsubmit={(e) => e.preventDefault()}
			use:reveal={{ type: 'block' }}
		>
			<div>
				<label for="essai-texte" class="mb-3 block label text-ash">Votre texte</label>
				<textarea
					id="essai-texte"
					bind:this={field}
					bind:value={text}
					rows="4"
					maxlength="400"
					spellcheck="false"
					aria-describedby="essai-aide"
					class="block w-full resize-y border border-smoke bg-ink px-4 py-3 text-bone transition-colors hover:border-ash"
				></textarea>
				<p id="essai-aide" class="mt-2 text-sm text-ash">
					Accents, ponctuation française et symboles de jeu compris.
				</p>
				<div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Insérer un caractère">
					{#each insert as i (i.char)}
						<button
							type="button"
							class="insert pixel"
							style={pixelVars(style, 2)}
							aria-label="Insérer : {i.label}"
							title="{i.label} ({codepoint(i.char.codePointAt(0)!)})"
							onclick={() => add(i.char)}>{i.char === NNBSP ? '⎵' : i.char}</button
						>
					{/each}
				</div>
			</div>

			{#if manifest.styles.length > 1}
				<ChoiceGroup
					legend="Style"
					name="essai-style"
					options={manifest.styles.map((s) => ({ value: s.id, label: s.style }))}
					bind:value={styleId}
				/>
			{:else}
				<div>
					<p class="mb-3 label text-ash">Style</p>
					<p class="text-bone">
						{styleName(style)} <span class="text-ash">· Bold, 16 Display et 5 Mini en dessin</span>
					</p>
				</div>
			{/if}

			<ChoiceGroup
				legend="Taille (toujours nette)"
				name="essai-taille"
				options={style.crispSizes.map((n) => ({
					value: n,
					label: `${n} px`,
					hint: `×${n / style.grid}`
				}))}
				bind:value={size}
			/>

			<ChoiceGroup
				legend="Couleurs"
				name="essai-couleurs"
				options={themes.map((t) => ({ value: t.value, label: t.label }))}
				bind:value={themeId}
			>
				{#snippet swatch(v)}
					{@const t = themes.find((x) => x.value === v)!}
					<span
						class="swatch"
						style="background: var(--color-{t.bg}); color: var(--color-{t.fg})"
						aria-hidden="true">A</span
					>
				{/snippet}
			</ChoiceGroup>
		</form>

		<div class="col-span-4 min-w-0 space-y-8 md:col-span-8 lg:col-span-8">
			<figure class="panel" use:wipe>
				<div
					class="stage"
					style="background: var(--color-{theme.bg}); color: var(--color-{theme.fg})"
				>
					<!-- prettier-ignore -->
					<p class="pixel break-words whitespace-pre-wrap" style={pixelVars(style, k)} use:crisp>{text || ' '}</p>
				</div>
				<figcaption class="caption">
					<span>Police web · WOFF2</span>
					<span>{styleName(style)} · {size} px · ×{k}</span>
				</figcaption>
			</figure>

			<figure class="panel" use:wipe={{ delay: 0.15 }}>
				<div class="stage" style="background: var(--color-{theme.bg})">
					<div use:crisp>
						<BitmapPreview {style} {text} {size} color={tokens[theme.fg] ?? ''} />
					</div>
				</div>
				<figcaption class="caption">
					<span>Canvas maison · atlas BMFont <code>.json</code> + <code>.png</code></span>
					<span>imageSmoothingEnabled = false · ×{k}</span>
				</figcaption>
			</figure>

			<p class="text-sm text-ash" aria-live="polite">
				{#if missing.length}
					<span class="text-signal">Absents de {styleName(style)} :</span>
					{missing.join(' ')} — affichés dans la police de secours.
				{:else}
					Les deux rendus doivent coïncider au pixel près.
				{/if}
			</p>
		</div>
	</div>
</section>

<style>
	.insert {
		display: inline-grid;
		place-items: center;
		min-width: 2.75rem;
		min-height: 2.75rem;
		padding: 0 0.5rem;
		border: 1px solid var(--color-smoke);
		color: var(--color-bone);
		transition: border-color 0.2s var(--ease-cardor-out);
	}
	.insert:hover {
		border-color: var(--color-signal);
	}
	.swatch {
		display: inline-grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border: 1px solid var(--color-smoke);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
	}
	.panel {
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
	}
	.stage {
		padding: 1.5rem;
		min-height: 8rem;
		overflow: clip;
		transition: background-color 0.2s var(--ease-cardor-out);
	}
	@media (width >= 48rem) {
		.stage {
			padding: 2.5rem;
		}
	}
	.caption {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.25rem 1.5rem;
		border-top: 1px solid var(--color-smoke);
		padding: 0.75rem 1rem;
		font-family: var(--font-mono);
		font-size: var(--text-micro);
		letter-spacing: var(--text-micro--letter-spacing);
		text-transform: uppercase;
		color: var(--color-ash);
	}
	.caption code {
		text-transform: none;
		color: var(--color-bone);
	}
</style>
