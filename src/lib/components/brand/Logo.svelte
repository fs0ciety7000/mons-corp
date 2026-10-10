<script lang="ts">
	import sprite from '#lib/assets/logos.svg?url';
	import { logos, type LogoName } from '#lib/data/logos.ts';

	interface Props {
		name: LogoName;
		/** color = brand colours · mono = currentColor · negative = currentColor with cut-outs */
		variant?: 'color' | 'mono';
		/** Accessible label. Omit for decorative use. */
		title?: string;
		class?: string;
	}

	let { name, variant = 'color', title, class: className = '' }: Props = $props();

	const meta = $derived(logos[name]);
	// <use> on a <symbol> renders at (0,0): normalise the outer viewBox to the symbol's size.
	const size = $derived(meta.viewBox.split(' ').slice(2).map(Number));

	// Mono: base tone follows currentColor; detail tones are darkened, the wheel hub is cut out.
	const style = $derived(
		[
			`aspect-ratio: ${meta.ratio}`,
			...(variant === 'mono'
				? [
						'--logo-t1: currentColor',
						name === 'cardor-monogram'
							? '--logo-t2: transparent'
							: '--logo-t2: color-mix(in oklab, currentColor 45%, black)',
						'--logo-t3: currentColor'
					]
				: [])
		].join(';')
	);
</script>

<svg
	viewBox="0 0 {size[0]} {size[1]}"
	class={['logo', className]}
	{style}
	role={title ? 'img' : undefined}
	aria-hidden={title ? undefined : 'true'}
	aria-label={title}
	data-logo={name}
>
	<use href="{sprite}#{name}" width={size[0]} height={size[1]} />
</svg>

<style>
	.logo {
		display: block;
		overflow: visible;
	}
</style>
