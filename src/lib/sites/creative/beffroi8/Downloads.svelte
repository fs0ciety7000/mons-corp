<script lang="ts">
	import { onDestroy } from 'svelte';
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { site } from '#lib/sites/config.ts';
	import { crisp, wipe } from './crisp.ts';
	import { copyText } from './copy.ts';
	import {
		asset,
		licenseOf,
		manifest,
		pixelVars,
		primary,
		styleName,
		zipPath
	} from './specimen.ts';
	import type { FontStyle, StyleFiles } from './types.ts';

	const license = licenseOf(manifest.license);

	const formats: { key: keyof StyleFiles; label: string; use: string }[] = [
		{ key: 'woff2', label: 'WOFF2', use: 'web' },
		{ key: 'ttf', label: 'TTF', use: 'bureau, moteurs' },
		{ key: 'otf', label: 'OTF', use: 'bureau, CFF' },
		{ key: 'xml', label: 'BMFont .xml', use: 'Phaser 3' },
		{ key: 'fnt', label: 'BMFont .fnt', use: 'texte' },
		{ key: 'png', label: 'Atlas .png', use: 'bitmap' },
		{ key: 'json', label: 'JSON', use: 'canvas maison' }
	];

	const fileName = (path: string) => path.split('/').pop() ?? path;
	/** Name of each style written in itself, about 32 px tall whatever its grid. */
	const nameK = (s: FontStyle) => Math.max(1, Math.round(32 / s.grid));

	const m = primary.metrics;
	const k2 = primary.crispSizes.find((n) => n / primary.grid === 2) ?? primary.grid * 2;
	const snippets = [
		{
			id: 'css',
			title: 'CSS · @font-face',
			code: `@font-face {
  font-family: "${primary.cssFamily}";
  src: url("${primary.files.woff2}") format("woff2"),
       url("${primary.files.ttf}") format("truetype");
  font-weight: ${primary.cssWeight};
  font-display: swap;
}

.hud {
  font-family: "${primary.cssFamily}", monospace;
  font-size: ${k2}px;   /* multiple de ${primary.grid} : ${primary.crispSizes.join(', ')} */
  line-height: ${(k2 / primary.grid) * m.lineHeight}px; /* ${m.lineHeight} px de grille × ${k2 / primary.grid} */
  font-synthesis: none;
  -webkit-font-smoothing: none;
  font-smooth: never;
}`
		},
		{
			id: 'phaser',
			title: 'Phaser 3 · bitmapFont',
			code: `// config du jeu : { pixelArt: true, roundPixels: true }

// preload()
this.load.bitmapFont(
  '${primary.id}',
  '${primary.files.png}',
  '${primary.files.xml}'
);

// create() : taille native ${primary.grid}, échelle entière
this.add
  .bitmapText(8, 8, '${primary.id}', 'SCORE 012340', ${primary.grid})
  .setScale(2);`
		}
	];

	let message = $state('');
	async function copy(id: string, code: string, title: string) {
		const ok = await copyText(code);
		message = ok ? `Extrait « ${title} » copié.` : 'Copie impossible : sélectionnez le code.';
		copiedId = ok ? id : null;
		clearTimeout(timer);
		timer = setTimeout(() => (copiedId = null), 1600);
	}
	let copiedId = $state<string | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;
	onDestroy(() => clearTimeout(timer));
</script>

<section id="telecharger" class="relative section-y" aria-labelledby="telecharger-title">
	<SectionHead
		index="04"
		label="Téléchargements"
		title={{ before: 'Dans votre', em: 'moteur.' }}
		id="telecharger-title"
	/>

	<div class="grid-cardor mt-12 gap-y-10 md:mt-16">
		<div class="col-span-4 min-w-0 space-y-8 md:col-span-8 lg:col-span-5">
			<a href={asset(zipPath)} download class="zip group" data-cursor="Télécharger" use:wipe>
				<span class="label text-ash">Archive complète · v{manifest.version}</span>
				<span class="font-display text-h2"
					>Tout <em class="text-signal">télécharger</em>
					<span
						aria-hidden="true"
						class="inline-block transition-transform group-hover:translate-y-1">↓</span
					></span
				>
				<span class="text-sm text-ash"
					>{zipPath} · polices, bitmap fonts, manifest, licence et lisez-moi</span
				>
			</a>

			<div class="license" use:wipe={{ delay: 0.1 }}>
				<p class="label text-signal">Licence · {manifest.license}</p>
				<p class="mt-3 font-display text-lead italic">{license.title}.</p>
				<p class="mt-3 text-ash">{license.text}</p>
				<p class="mt-4">
					<a
						href="mailto:{site.email}?subject=Beffroi%208"
						class="text-bone underline decoration-1 underline-offset-4 hover:text-signal"
						>{site.email}</a
					>
				</p>
			</div>
		</div>

		<ul
			class="col-span-4 min-w-0 space-y-6 md:col-span-8 lg:col-span-7"
			aria-label="Fichiers par style"
		>
			{#each manifest.styles as s (s.id)}
				<li class="style-card" use:wipe={{ delay: 0.15 }}>
					<h3 class="sr-only">{styleName(s)}</h3>
					<p class="overflow-clip" aria-hidden="true">
						<span class="pixel block" style={pixelVars(s, nameK(s))} use:crisp
							>{s.family} {s.style}</span
						>
					</p>
					<p class="mt-3 label text-ash">
						Grille {s.grid} px · tailles nettes {s.crispSizes.join(' · ')} px · {s.glyphs.length} glyphes
					</p>
					<ul class="mt-6 flex flex-wrap gap-2">
						{#each formats as f (f.key)}
							<li>
								<a
									href={asset(s.files[f.key])}
									download={fileName(s.files[f.key])}
									class="file"
									aria-label="{f.label} ({f.use}) — {styleName(s)}"
									data-cursor="Télécharger"
								>
									<span>{f.label}</span>
									<span class="text-ash">{f.use}</span>
								</a>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>

		{#each snippets as sn, i (sn.id)}
			<figure class="col-span-4 min-w-0 md:col-span-8 lg:col-span-6" use:wipe={{ delay: 0.1 * i }}>
				<figcaption class="code-head">
					<span class="label text-ash">{sn.title}</span>
					<button
						type="button"
						class="copy"
						class:is-copied={copiedId === sn.id}
						onclick={() => copy(sn.id, sn.code, sn.title)}
						>{copiedId === sn.id ? 'Copié ✓' : 'Copier'}</button
					>
				</figcaption>
				<pre class="code"><code>{sn.code}</code></pre>
			</figure>
		{/each}

		<p class="col-span-4 min-h-6 text-sm text-ash md:col-span-8" role="status" aria-live="polite">
			{message}
		</p>
	</div>
</section>

<style>
	.zip {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 2rem;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		transition: border-color 0.5s var(--ease-cardor-out);
	}
	.zip:hover,
	.zip:focus-visible {
		border-color: color-mix(in oklab, var(--color-signal) 50%, var(--color-smoke));
	}
	.license {
		border-left: 1px solid var(--color-signal);
		padding-left: 1.5rem;
	}
	.style-card {
		border: 1px solid var(--color-smoke);
		padding: 1.5rem;
	}
	@media (width >= 48rem) {
		.style-card {
			padding: 2rem;
		}
	}
	.file {
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		min-height: 2.75rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-smoke);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1.3;
		transition: border-color 0.2s var(--ease-cardor-out);
	}
	.file span:last-child {
		font-size: var(--text-micro);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.file:hover {
		border-color: var(--color-signal);
	}
	.code-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.5rem 0.5rem 0.5rem 1rem;
		border: 1px solid var(--color-smoke);
		border-bottom: 0;
	}
	.copy {
		min-height: 2.75rem;
		padding: 0 1rem;
		border: 1px solid var(--color-smoke);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: var(--text-micro);
		letter-spacing: var(--text-micro--letter-spacing);
		text-transform: uppercase;
		transition:
			border-color 0.2s var(--ease-cardor-out),
			color 0.2s var(--ease-cardor-out);
	}
	.copy:hover,
	.copy.is-copied {
		border-color: var(--color-signal);
		color: var(--color-signal);
	}
	.code {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		padding: 1.25rem;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-bone);
		tab-size: 2;
	}
</style>
