<script lang="ts">
	import Seo from '#lib/components/seo/Seo.svelte';
	import Logo from '#lib/components/brand/Logo.svelte';
	import Construction from '#lib/components/brand/Construction.svelte';
	import { emblems, type LogoName } from '#lib/data/logos.ts';
	import { reveal } from '#lib/motion/actions.ts';

	const marks: { name: LogoName; label: string; accent: string }[] = [
		{ name: 'cardor-monogram', label: 'CARDOR Media — monogramme « La roue »', accent: '#D4A84B' },
		{ name: 'cardor-emblem', label: 'CARDOR Media — emblème « Le Car d’Or »', accent: '#D4A84B' },
		{ name: 'interactive', label: 'OCC Interactive — « Le Dragon »', accent: '#C6FF3D' },
		{ name: 'sound', label: 'OCC Soundworks — « Le Beffroi »', accent: '#7B5CFF' },
		{ name: 'creative', label: 'OCC Creative Lab — « Le Singe »', accent: '#FFB547' }
	];

	const swatches = [
		{ group: 'Holding', name: 'Or', hex: '#D4A84B', use: 'Logo holding, héritage' },
		{ group: 'Holding', name: 'Ember', hex: '#FF3B1F', use: 'Noyau, CTA, accent unique' },
		{ group: 'Neutres', name: 'Void', hex: '#07070A', use: 'Fond' },
		{ group: 'Neutres', name: 'Bone', hex: '#EDE8DF', use: 'Monochrome, texte' },
		{ group: 'Neutres', name: 'Paper', hex: '#F6F3EE', use: 'Fond négatif' },
		{ group: 'Interactive', name: 'Acid', hex: '#C6FF3D', use: 'Dragon — facettes claires' },
		{ group: 'Interactive', name: 'Olive', hex: '#5B7A00', use: 'Dragon — facettes sombres' },
		{ group: 'Soundworks', name: 'Ultraviolet', hex: '#7B5CFF', use: 'Beffroi' },
		{ group: 'Soundworks', name: 'Indigo', hex: '#3A2A9E', use: 'Profondeur' },
		{ group: 'Creative Lab', name: 'Amber', hex: '#FFB547', use: 'Singe — trait' },
		{ group: 'Creative Lab', name: 'Ochre', hex: '#A66A0B', use: 'Singe — ombre, plume' }
	];

	function rgb(hex: string) {
		const n = parseInt(hex.slice(1), 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	}
	/** Naive RGB → CMYK (screen reference; validate on a press proof). */
	function cmyk(hex: string) {
		const [r, g, b] = rgb(hex).map((v) => v / 255);
		const k = 1 - Math.max(r, g, b);
		if (k === 1) return '0 0 0 100';
		return [r, g, b]
			.map((v) => Math.round(((1 - v - k) / (1 - k)) * 100))
			.concat(Math.round(k * 100))
			.join(' ');
	}

	const sizes = [16, 24, 32, 48, 96];
	const minimum: Record<LogoName, string> = {
		'cardor-monogram': '16 px · 5 mm',
		'cardor-emblem': '32 px · 12 mm',
		interactive: '24 px · 8 mm',
		sound: '32 px · 10 mm (hauteur)',
		creative: '24 px · 8 mm'
	};

	const donts = [
		{ label: 'Ne pas déformer', style: 'transform: scaleX(1.45)' },
		{ label: 'Ne pas pivoter', style: 'transform: rotate(-18deg)' },
		{
			label: 'Pas d’effets ni d’ombres',
			style: 'filter: drop-shadow(0 0 14px #ff3b1f) blur(0.6px)'
		},
		{
			label: 'Pas de couleur hors charte',
			style: '--logo-t1: #3cf; --logo-t2: #f0f; --logo-t3: #0f0'
		},
		{ label: 'Pas de fond chargé', style: '', busy: true },
		{ label: 'Pas d’emblème d’une autre division', style: '', swap: true }
	];

	const downloads: { file: string; label: string }[] = [
		{ file: 'cardor-monogram.svg', label: 'Monogramme CARDOR (roue)' },
		{ file: 'cardor-emblem.svg', label: 'Emblème CARDOR (Car d’Or)' },
		{ file: 'interactive.svg', label: 'OCC Interactive (Dragon)' },
		{ file: 'sound.svg', label: 'OCC Soundworks (Beffroi)' },
		{ file: 'creative.svg', label: 'OCC Creative Lab (Singe)' }
	];
</script>

<Seo page="marque" />

<div class="blueprint">
	<!-- Title block -->
	<section class="pt-36 pb-16 md:pt-48" aria-labelledby="marque-title">
		<div class="grid-cardor gap-y-8">
			<p
				class="col-span-4 label text-ash md:col-span-8 lg:col-span-12"
				use:reveal={{ start: false }}
			>
				Charte de marque · Sketchboard technique · v1.0
			</p>
			<h1
				id="marque-title"
				class="col-span-4 font-display text-display md:col-span-8 lg:col-span-10"
				use:reveal={{ type: 'chars', start: false, delay: 0.2 }}
			>
				Le cortège <em class="text-or">montois</em>.
			</h1>
			<p
				class="col-span-4 max-w-[60ch] text-lead text-ash md:col-span-6"
				use:reveal={{ start: false, delay: 0.45 }}
			>
				Un emblème du patrimoine de Mons par entité. Le Car d’Or pour la holding, le Dragon pour
				Interactive, le Beffroi pour Soundworks, le Singe du Grand-Garde pour Creative Lab.
				Ensemble, ils forment le cortège du Doudou.
			</p>
			<dl
				class="cartouche col-span-4 grid grid-cols-2 border border-smoke md:col-span-8 md:grid-cols-4 lg:col-span-6 lg:col-start-7"
			>
				{#each [['Projet', 'CARDOR Media'], ['Planche', 'A — G'], ['Révision', '1.0 · 2026-10-10'], ['Module', 'x = H / 10'], ['Dessin', 'Design Agent'], ['Motion', 'Motion Agent'], ['Intégration', 'Tech Lead'], ['Validation', 'PM']] as [k, v] (k)}
					<div class="border-smoke p-3">
						<dt class="label text-ash">{k}</dt>
						<dd class="mt-1 text-sm">{v}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</section>

	<!-- A. Construction -->
	<section class="border-t border-smoke section-y" aria-labelledby="a-title">
		<div class="grid-cardor gap-y-6">
			<p class="col-span-4 label text-ember md:col-span-2 lg:col-span-3">Planche A</p>
			<h2 id="a-title" class="col-span-4 font-display text-h1 md:col-span-6 lg:col-span-9">
				Construction &amp; <em>zone de protection</em>
			</h2>
			<p class="col-span-4 max-w-[60ch] text-ash md:col-span-6 lg:col-span-6 lg:col-start-4">
				Module <span class="font-mono text-bone">x</span> = un dixième de la hauteur du signe. La
				zone de protection vaut <span class="font-mono text-bone">2x</span> sur chaque côté. Le monogramme
				est un redessin géométrique : 14 rayons répartis à 25,714°, jante 3,4, moyeu 8,4, noyau 2,4 (unités
				: 1/100 du diamètre).
			</p>
		</div>
		<div class="grid-cardor mt-14 gap-y-14">
			{#each marks as mk, i (mk.name)}
				<div
					class={[
						'col-span-4 md:col-span-8',
						i === 0 ? 'lg:col-span-12 lg:px-[16%]' : 'lg:col-span-6'
					]}
				>
					<Construction name={mk.name} label={mk.label} />
				</div>
			{/each}
		</div>
	</section>

	<!-- B. Sizes -->
	<section class="border-t border-smoke section-y" aria-labelledby="b-title">
		<div class="grid-cardor gap-y-6">
			<p class="col-span-4 label text-ember md:col-span-2 lg:col-span-3">Planche B</p>
			<h2 id="b-title" class="col-span-4 font-display text-h1 md:col-span-6 lg:col-span-9">
				Tailles <em>minimales</em>
			</h2>
		</div>
		<div class="mt-12 overflow-x-auto gutter-x">
			<table class="w-full border-collapse text-left">
				<thead>
					<tr class="label text-ash">
						<th class="py-3 font-normal">Signe</th>
						{#each sizes as s (s)}<th class="py-3 font-normal">{s} px</th>{/each}
						<th class="py-3 text-right font-normal">Minimum écran · print</th>
					</tr>
				</thead>
				<tbody>
					{#each marks as mk (mk.name)}
						<tr class="border-t border-smoke">
							<td class="py-5 pr-4 text-sm">{emblems[mk.name].motif}</td>
							{#each sizes as s (s)}
								<td class="py-5 pr-4">
									<div style:height="{s}px" class="flex items-end">
										<Logo name={mk.name} class="h-full w-auto" />
									</div>
								</td>
							{/each}
							<td class="py-5 text-right label text-bone">{minimum[mk.name]}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- C. Colours -->
	<section class="border-t border-smoke section-y" aria-labelledby="c-title">
		<div class="grid-cardor gap-y-6">
			<p class="col-span-4 label text-ember md:col-span-2 lg:col-span-3">Planche C</p>
			<h2 id="c-title" class="col-span-4 font-display text-h1 md:col-span-6 lg:col-span-9">
				Couleurs <em>de marque</em>
			</h2>
			<p class="col-span-4 text-ash md:col-span-6 lg:col-span-6 lg:col-start-4">
				CMJN indicatif, calculé depuis le RVB : valider les références Pantone sur nuancier et
				épreuve avant toute impression.
			</p>
		</div>
		<ul class="grid-cardor mt-12 gap-y-4">
			{#each swatches as sw (sw.name)}
				<li class="col-span-2 md:col-span-2 lg:col-span-3">
					<div class="aspect-[4/3] border border-smoke" style:background={sw.hex}></div>
					<p class="mt-3 label text-ash">{sw.group}</p>
					<p class="font-display text-h2 leading-none">{sw.name}</p>
					<dl class="mt-2 grid grid-cols-[3.5rem_1fr] gap-x-2 font-mono text-xs text-ash">
						<dt>HEX</dt>
						<dd class="text-bone">{sw.hex}</dd>
						<dt>RVB</dt>
						<dd>{rgb(sw.hex).join(' ')}</dd>
						<dt>CMJN</dt>
						<dd>{cmyk(sw.hex)}</dd>
					</dl>
					<p class="mt-2 text-xs text-ash">{sw.use}</p>
				</li>
			{/each}
		</ul>
	</section>

	<!-- D. Versions -->
	<section class="border-t border-smoke section-y" aria-labelledby="d-title">
		<div class="grid-cardor gap-y-6">
			<p class="col-span-4 label text-ember md:col-span-2 lg:col-span-3">Planche D</p>
			<h2 id="d-title" class="col-span-4 font-display text-h1 md:col-span-6 lg:col-span-9">
				Versions <em>couleur, mono, négatif</em>
			</h2>
		</div>
		<div class="mt-12 gutter-x">
			<div class="grid grid-cols-[minmax(7rem,1fr)_repeat(4,minmax(0,1.4fr))] gap-px bg-smoke">
				{#each ['Signe', 'Couleur', 'Mono bone', 'Mono or / signal', 'Négatif'] as h (h)}
					<div class="bg-void p-3 label text-ash">{h}</div>
				{/each}
				{#each marks as mk (mk.name)}
					<div class="flex items-center bg-void p-3 text-sm">{emblems[mk.name].motif}</div>
					<div class="relative aspect-[4/3] bg-void">
						<div class="absolute inset-[14%]">
							<Logo name={mk.name} animate="hover" class="size-full" />
						</div>
					</div>
					<div class="relative aspect-[4/3] bg-void text-bone">
						<div class="absolute inset-[14%]">
							<Logo name={mk.name} variant="mono" class="size-full" />
						</div>
					</div>
					<div class="relative aspect-[4/3] bg-void" style:color={mk.accent}>
						<div class="absolute inset-[14%]">
							<Logo name={mk.name} variant="mono" class="size-full" />
						</div>
					</div>
					<div class="relative aspect-[4/3] bg-paper text-void">
						<div class="absolute inset-[14%]">
							<Logo name={mk.name} variant="mono" class="size-full" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- E. Lockups -->
	<section class="border-t border-smoke section-y" aria-labelledby="e-title">
		<div class="grid-cardor gap-y-6">
			<p class="col-span-4 label text-ember md:col-span-2 lg:col-span-3">Planche E</p>
			<h2 id="e-title" class="col-span-4 font-display text-h1 md:col-span-6 lg:col-span-9">
				Lockups <em>typographiques</em>
			</h2>
			<p class="col-span-4 max-w-[60ch] text-ash md:col-span-6 lg:col-span-6 lg:col-start-4">
				Composés en vraies polices : Instrument Serif pour les noms (« Media » toujours en italique
				or), Geist Mono espacé pour « OCC ». L'écart entre le signe et le texte vaut
				<span class="font-mono text-bone">1x</span> ; la hauteur du signe vaut la hauteur de capitale
				plus le jambage.
			</p>
		</div>
		<div class="grid-cardor mt-12 gap-6">
			<div class="lockup col-span-4 md:col-span-8 lg:col-span-6">
				<div class="flex items-center gap-[0.35em] text-[clamp(2.5rem,5vw,4.5rem)]">
					<Logo name="cardor-monogram" animate="hover" host=".lockup" class="h-[1.05em] w-auto" />
					<span class="font-display leading-none tracking-[-0.02em]"
						>CARDOR<span class="ml-[0.18em] text-or italic">Media</span></span
					>
				</div>
				<p class="lockup-label">Holding · horizontal</p>
			</div>
			<div class="lockup col-span-4 md:col-span-8 lg:col-span-6">
				<div class="flex flex-col items-center text-[clamp(2.5rem,5vw,4.5rem)]">
					<Logo
						name="cardor-emblem"
						animate="hover"
						host=".lockup"
						class="h-[1.6em] w-auto text-or"
						variant="mono"
					/>
					<span class="mt-[0.3em] font-display leading-none tracking-[-0.02em]">CARDOR</span>
					<span class="font-display text-[0.62em] leading-none text-or italic">Media</span>
				</div>
				<p class="lockup-label">Holding · vertical (héritage)</p>
			</div>
			{#each [{ id: 'interactive', n: 'Interactive', it: false, c: '#C6FF3D' }, { id: 'sound', n: 'Soundworks', it: true, c: '#7B5CFF' }, { id: 'creative', n: 'Creative Lab', it: true, c: '#FFB547' }] as l (l.id)}
				<div class="lockup col-span-4 md:col-span-8 lg:col-span-4">
					<div class="flex items-center gap-[0.4em] text-[clamp(2rem,3.4vw,3.2rem)]">
						<Logo name={l.id as LogoName} animate="hover" host=".lockup" class="h-[1.5em] w-auto" />
						<span class="flex flex-col">
							<span class="font-mono text-[0.3em] tracking-[0.5em]" style:color={l.c}>OCC</span>
							<span class={['font-display leading-none', l.it && 'italic']}>{l.n}</span>
						</span>
					</div>
					<p class="lockup-label">Division · horizontal</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- F. Don'ts -->
	<section class="border-t border-smoke section-y" aria-labelledby="f-title">
		<div class="grid-cardor gap-y-6">
			<p class="col-span-4 label text-ember md:col-span-2 lg:col-span-3">Planche F</p>
			<h2 id="f-title" class="col-span-4 font-display text-h1 md:col-span-6 lg:col-span-9">
				<em>Interdits</em>
			</h2>
		</div>
		<ul class="grid-cardor mt-12 gap-y-6">
			{#each donts as d (d.label)}
				<li class="col-span-2 md:col-span-4 lg:col-span-2">
					<div
						class={[
							'dont relative grid aspect-square place-items-center overflow-hidden border border-smoke p-6',
							d.busy && 'busy'
						]}
					>
						<div class="absolute inset-[22%]" style={d.style}>
							<Logo name={d.swap ? 'interactive' : 'cardor-monogram'} class="size-full" />
						</div>
						{#if d.swap}<span class="absolute bottom-2 left-2 label text-ash">« Soundworks »</span
							>{/if}
					</div>
					<p class="mt-3 text-sm text-ash">✕ {d.label}</p>
				</li>
			{/each}
		</ul>
	</section>

	<!-- G. Downloads -->
	<section class="border-t border-smoke section-y" aria-labelledby="g-title">
		<div class="grid-cardor gap-y-6">
			<p class="col-span-4 label text-ember md:col-span-2 lg:col-span-3">Planche G</p>
			<h2 id="g-title" class="col-span-4 font-display text-h1 md:col-span-6 lg:col-span-9">
				Fichiers <em>sources</em>
			</h2>
		</div>
		<ul class="grid-cardor mt-12 gap-y-3">
			{#each downloads as dl (dl.file)}
				<li class="col-span-4 md:col-span-4 lg:col-span-4">
					<a
						href="/brand/{dl.file}"
						download
						class="flex items-center justify-between border border-smoke px-5 py-4 transition-colors hover:border-bone"
						data-cursor="SVG"
					>
						<span class="text-sm">{dl.label}</span>
						<span class="label text-ash">SVG ↓</span>
					</a>
				</li>
			{/each}
		</ul>
		<p class="mt-10 max-w-[70ch] gutter-x text-sm text-ash">
			Emblèmes issus d’explorations génératives (Nano Banana), sélectionnés puis vectorisés ; le
			monogramme est redessiné géométriquement. Un redessin manuel du Dragon, du Beffroi et du Singe
			est prévu avant toute production imprimée.
		</p>
	</section>
</div>

<style>
	.blueprint {
		background-image:
			linear-gradient(
				color-mix(in oklab, var(--color-smoke) 35%, transparent) 1px,
				transparent 1px
			),
			linear-gradient(
				90deg,
				color-mix(in oklab, var(--color-smoke) 35%, transparent) 1px,
				transparent 1px
			);
		background-size: 64px 64px;
		background-position: -1px -1px;
	}
	.cartouche > div {
		border-right-width: 1px;
		border-bottom-width: 1px;
	}
	.lockup {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 18rem;
		border: 1px solid var(--color-smoke);
		background: var(--color-void);
		padding: 3rem 2rem 3.5rem;
	}
	.lockup-label {
		position: absolute;
		left: 1rem;
		bottom: 0.9rem;
		font-family: var(--font-mono);
		font-size: var(--text-micro);
		letter-spacing: var(--text-micro--letter-spacing);
		text-transform: uppercase;
		color: var(--color-ash);
	}
	.dont::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top right,
			transparent calc(50% - 1px),
			var(--color-ember) calc(50% - 1px),
			var(--color-ember) calc(50% + 1px),
			transparent calc(50% + 1px)
		);
		opacity: 0.85;
	}
	.dont.busy {
		background: repeating-conic-gradient(#ff3b1f 0 25%, #c6ff3d 0 50%) 0 0 / 22px 22px;
	}
</style>
