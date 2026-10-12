<script lang="ts">
	import { divisions } from '#lib/data/divisions.ts';
	import { site } from '#lib/data/site.ts';
	import { magnetic, reveal } from '#lib/motion/actions.ts';
	import MonsClock from './MonsClock.svelte';
	import { socials } from '#lib/data/social.ts';
	import Logo from '#lib/components/brand/Logo.svelte';
	import { onMount } from 'svelte';
	import { gsap } from '#lib/motion/gsap.ts';
	import { prefersReducedMotion } from '#lib/motion/tokens.ts';
	import type { EmblemParts } from '#lib/brand/emblem-motion.ts';
	import { isHolding, isMaison, site as current, siteUrl, SITE } from '#lib/sites/config.ts';

	const word = isMaison ? 'CARDOR' : current.short;
	const sectionLinks = isHolding
		? [
				{ href: '/#manifeste', label: 'Manifeste' },
				{ href: '/#cortege', label: 'Héritage' },
				{ href: '/marque', label: 'Charte de marque' },
				{ href: '/contact', label: 'Contact' }
			]
		: isMaison
			? current.nav
			: [...current.nav, { href: '/#emblème', label: 'Emblème' }];

	let carriage: HTMLElement;

	// The Car d'Or wheels turn while it climbs (scroll-linked), and on hover.
	function rollWheels({ wheels }: EmblemParts) {
		if (prefersReducedMotion() || !wheels.length) return;
		gsap.fromTo(
			wheels,
			{ rotation: -540 },
			{
				rotation: 0,
				ease: 'none',
				transformOrigin: '50% 50%',
				scrollTrigger: { trigger: carriage, start: 'top bottom', end: 'top 55%', scrub: 0.8 }
			}
		);
	}

	// "La montée du Car d'Or": the carriage climbs into frame as the footer arrives.
	onMount(() => {
		if (prefersReducedMotion()) return;
		const ctx = gsap.context(() => {
			gsap.fromTo(
				carriage,
				{ xPercent: -160, yPercent: 40, rotate: -6 },
				{
					xPercent: 0,
					yPercent: 0,
					rotate: 0,
					ease: 'none',
					scrollTrigger: { trigger: carriage, start: 'top bottom', end: 'top 55%', scrub: 0.8 }
				}
			);
		});
		return () => ctx.revert();
	});
</script>

<footer class="relative overflow-clip border-t border-smoke pt-24 md:pt-40">
	<div class="grid-cardor gap-y-12">
		<p class="col-span-4 label text-ash md:col-span-8 lg:col-span-12" use:reveal>Contact</p>
		<h2
			class="col-span-4 font-display text-display md:col-span-8 lg:col-span-9"
			use:reveal={{ type: 'chars' }}
		>
			Fabriquons <em class="text-signal">votre</em> monde.
		</h2>
		<div class="col-span-4 flex items-end md:col-span-8 lg:col-span-3 lg:justify-end">
			<a
				href="mailto:{site.email}"
				use:magnetic={0.35}
				data-cursor="Écrire"
				class="cta group relative inline-flex items-center gap-3 overflow-clip rounded-full bg-bone px-7 py-4 text-void"
			>
				<span class="relative z-10 font-medium">{site.email}</span>
				<span class="relative z-10" aria-hidden="true">→</span>
			</a>
		</div>
	</div>

	<div class="grid-cardor mt-24 gap-y-10 border-t border-smoke pt-10 md:mt-32">
		<div class="col-span-4 lg:col-span-4">
			<p class="mb-4 label text-ash">{isHolding ? 'Divisions' : 'La maison'}</p>
			<ul class="space-y-2">
				{#if !isHolding}
					<li><a href={siteUrl('holding')} class="foot-link">CARDOR Media ↗</a></li>
				{/if}
				{#each divisions as d (d.id)}
					<li>
						<a
							href={d.id === current.id ? '/' : d.url}
							class="foot-link"
							style:--division={d.color}
							aria-current={d.id === current.id ? 'page' : undefined}>{d.name}</a
						>
					</li>
				{/each}
				{#if SITE !== 'apps'}
					<li><a href={siteUrl('apps')} class="foot-link">Tous les projets ↗</a></li>
				{/if}
			</ul>
		</div>
		<div class="col-span-2 lg:col-span-3">
			<p class="mb-4 label text-ash">{isHolding ? 'Maison' : current.short}</p>
			<ul class="space-y-2">
				{#each sectionLinks as l (l.href)}
					<li><a href={l.href} class="foot-link">{l.label}</a></li>
				{/each}
			</ul>
		</div>
		<div class="col-span-2 md:col-span-8 lg:col-span-5 lg:text-right">
			<p class="mb-4 label text-ash">{site.city}</p>
			<MonsClock />
		</div>
	</div>

	<div
		class="mt-20 flex flex-col justify-between gap-4 gutter-x pb-8 text-ash md:flex-row md:items-center"
	>
		<span class="label"
			>© {new Date().getFullYear()}
			{isMaison ? 'CARDOR Media' : `${current.name} · une division de CARDOR Media`} — Tous droits réservés</span
		>
		<ul class="-mx-3 flex items-center gap-1" aria-label="CARDOR Media sur les réseaux sociaux">
			{#each socials as s (s.id)}
				<li>
					<a
						href={s.url}
						target="_blank"
						rel="noopener me"
						class="social"
						aria-label="{s.name} {s.handle} (nouvel onglet)"
						data-cursor={s.name}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.path} /></svg>
						<span class="label">{s.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="mt-16 flex items-end justify-between gap-6 gutter-x">
		<div
			bind:this={carriage}
			class={[
				isMaison ? 'w-[clamp(7rem,14vw,13rem)] text-or' : 'h-[clamp(5rem,10vw,9rem)]',
				'shrink-0'
			]}
		>
			{#if isMaison}
				<Logo name="cardor-emblem" variant="mono" onready={rollWheels} class="w-full" />
			{:else}
				<Logo name={current.emblem} animate="hover" class="h-full w-auto" />
			{/if}
		</div>
		<p class="max-w-[34ch] text-right label text-ash">
			{#if isMaison}
				Né à Mons<br />sous le signe du Car d’Or
			{:else}
				Une division de CARDOR Media<br />née à Mons, sous le signe du Doudou
			{/if}
		</p>
	</div>

	<p
		class="pointer-events-none mt-4 -mb-[0.18em] text-center font-display leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-graphite select-none"
		style:font-size="{Math.min(33, 200 / word.length)}vw"
		aria-hidden="true"
	>
		{word}
	</p>
</footer>

<style>
	.cta::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--color-signal);
		transform: translateY(101%);
		border-radius: inherit;
		transition: transform 0.6s var(--ease-cardor-out);
	}
	.cta:hover::before,
	.cta:focus-visible::before {
		transform: translateY(0);
	}
	.cta:active {
		scale: 0.97;
	}
	.social {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		padding-inline: 0.75rem;
		border-radius: 999px;
		color: var(--color-ash);
		transition:
			color 0.3s,
			background-color 0.3s;
	}
	.social svg {
		width: 1.1rem;
		height: 1.1rem;
		fill: currentColor;
	}
	.social:hover,
	.social:focus-visible {
		color: var(--color-bone);
		background: var(--color-graphite);
	}
	.foot-link {
		background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
		transition:
			background-size 0.6s var(--ease-cardor-out),
			color 0.3s;
	}
	.foot-link:hover,
	.foot-link:focus-visible {
		background-size: 100% 1px;
		color: var(--division, var(--color-bone));
	}
</style>
