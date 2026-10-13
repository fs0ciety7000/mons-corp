<script lang="ts" generics="T extends string | number">
	import type { Snippet } from 'svelte';

	/**
	 * Native radio group drawn as chips: arrow keys move the choice, Tab leaves the group.
	 * Selected chip = bone fill; focus ring = site signal (design report §7).
	 */
	let {
		legend,
		name,
		options,
		value = $bindable(),
		swatch,
		class: klass = ''
	}: {
		legend: string;
		name: string;
		options: { value: T; label: string; hint?: string }[];
		value: T;
		swatch?: Snippet<[T]>;
		class?: string;
	} = $props();
</script>

<fieldset class={['min-w-0', klass]}>
	<legend class="mb-3 label text-ash">{legend}</legend>
	<div class="flex flex-wrap gap-2">
		{#each options as o (o.value)}
			<label class="chip" data-cursor="Choisir">
				<input type="radio" {name} value={o.value} bind:group={value} class="sr-only" />
				{#if swatch}{@render swatch(o.value)}{/if}
				<span>{o.label}</span>
				{#if o.hint}<span class="text-[0.75em] opacity-70">{o.hint}</span>{/if}
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		padding: 0 1rem;
		border: 1px solid var(--color-smoke);
		border-radius: 999px;
		color: var(--color-bone);
		font-size: 0.9375rem;
		cursor: pointer;
		user-select: none;
		transition:
			border-color 0.2s var(--ease-cardor-out),
			background-color 0.2s var(--ease-cardor-out),
			color 0.2s var(--ease-cardor-out);
	}
	.chip:hover {
		border-color: var(--color-bone);
	}
	.chip:has(:checked) {
		background: var(--color-bone);
		border-color: var(--color-bone);
		color: var(--color-void);
	}
	.chip:has(:focus-visible) {
		outline: 2px solid var(--color-signal);
		outline-offset: 4px;
	}
</style>
