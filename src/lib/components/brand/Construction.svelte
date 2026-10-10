<script lang="ts">
	import sprite from '#lib/assets/logos.svg?url';
	import { logos, type LogoName } from '#lib/data/logos.ts';

	/**
	 * Technical construction drawing of a mark: module grid, bounding box, axes,
	 * dimension lines (in modules x = 1/10 of the mark height) and the 2x clear-space zone.
	 */
	let { name, label }: { name: LogoName; label: string } = $props();

	const meta = $derived(logos[name]);
	const vb = $derived(meta.viewBox.split(' ').map(Number) as [number, number, number, number]);
	const g = $derived.by(() => {
		const [x, y, w, h] = vb;
		const m = h / 10;
		const c = 2 * m;
		const pad = c + 1.6 * m;
		return {
			x,
			y,
			w,
			h,
			m,
			c,
			cx: x + w / 2,
			cy: y + h / 2,
			outer: [x - pad, y - pad, w + 2 * pad, h + 2 * pad] as const,
			fs: m * 0.42,
			cols: Array.from({ length: Math.floor(w / m) + 1 }, (_, i) => x + i * m),
			rows: Array.from({ length: 11 }, (_, i) => y + i * m)
		};
	});
	const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 1 });

	// Geometry of the redrawn monogram (scripts/build-monogram.py).
	const SPOKES = Array.from({ length: 14 }, (_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / 14);
	const arc = (r: number, a0: number, a1: number) =>
		`M${50 + r * Math.cos(a0)} ${50 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${50 + r * Math.cos(a1)} ${50 + r * Math.sin(a1)}`;
</script>

<figure class="construction">
	<svg
		viewBox={g.outer.join(' ')}
		class="w-full"
		role="img"
		aria-label="Épure de construction : {label}"
	>
		<defs>
			<marker
				id="arr-{name}"
				viewBox="0 0 10 10"
				refX="5"
				refY="5"
				markerWidth="6"
				markerHeight="6"
				orient="auto-start-reverse"
			>
				<path d="M0 1 L9 5 L0 9 Z" fill="var(--dim)" />
			</marker>
		</defs>

		<!-- 2x clear-space zone -->
		<rect x={g.x - g.c} y={g.y - g.c} width={g.w + 2 * g.c} height={g.h + 2 * g.c} class="clear" />
		<text x={g.x - g.c + g.fs * 0.6} y={g.y - g.c - g.fs * 0.6} class="t dim" font-size={g.fs}>
			ZONE DE PROTECTION = 2x
		</text>

		<!-- module grid -->
		{#each g.cols as cx (cx)}<line x1={cx} y1={g.y} x2={cx} y2={g.y + g.h} class="grid" />{/each}
		{#each g.rows as ry (ry)}<line x1={g.x} y1={ry} x2={g.x + g.w} y2={ry} class="grid" />{/each}

		<!-- axes -->
		<line x1={g.cx} y1={g.y - g.c * 1.3} x2={g.cx} y2={g.y + g.h + g.c * 1.3} class="axis" />
		<line x1={g.x - g.c * 1.3} y1={g.cy} x2={g.x + g.w + g.c * 1.3} y2={g.cy} class="axis" />

		<!-- the mark -->
		<g
			style="--logo-t1: var(--ink-mark); --logo-t2: color-mix(in oklab, var(--ink-mark) 45%, black); --logo-t3: var(--ink-mark)"
		>
			<use href="{sprite}#{name}" x={g.x} y={g.y} width={g.w} height={g.h} />
		</g>
		<rect x={g.x} y={g.y} width={g.w} height={g.h} class="box" />

		{#if name === 'cardor-monogram'}
			{#each SPOKES as a (a)}
				<line x1="50" y1="50" x2={50 + 54 * Math.cos(a)} y2={50 + 54 * Math.sin(a)} class="ray" />
			{/each}
			{#each [50, 46.6, 8.4, 2.4] as r (r)}<circle cx="50" cy="50" {r} class="circ" />{/each}
			<path d={arc(30, SPOKES[0], SPOKES[1])} class="dimline" />
			<text
				x={50 + 33 * Math.cos(SPOKES[0] + 0.22)}
				y={50 + 33 * Math.sin(SPOKES[0] + 0.22)}
				class="t dim"
				font-size={g.fs}>360/14 = 25,714°</text
			>
			<polyline points="55.9,55.9 66,70 80,70" class="dimline" />
			<text x="81" y="70.8" class="t dim" font-size={g.fs * 0.8}>MOYEU R 8,4</text>
			<polyline points="51.7,51.7 60,78 80,78" class="dimline" />
			<text x="81" y="78.8" class="t dim" font-size={g.fs * 0.8}>NOYAU R 2,4</text>
			<text
				x={50 + 47 * Math.cos(-0.9)}
				y={50 + 47 * Math.sin(-0.9) - 1.2}
				class="t dim"
				font-size={g.fs * 0.8}>JANTE 3,4</text
			>
		{/if}

		<!-- dimensions -->
		<line
			x1={g.x}
			y1={g.y - g.c * 0.5}
			x2={g.x + g.w}
			y2={g.y - g.c * 0.5}
			class="dimline"
			marker-start="url(#arr-{name})"
			marker-end="url(#arr-{name})"
		/>
		<text
			x={g.cx}
			y={g.y - g.c * 0.5 - g.fs * 0.5}
			text-anchor="middle"
			class="t dim"
			font-size={g.fs}>{fmt(g.w / g.m)}x</text
		>
		<line
			x1={g.x + g.w + g.c * 0.5}
			y1={g.y}
			x2={g.x + g.w + g.c * 0.5}
			y2={g.y + g.h}
			class="dimline"
			marker-start="url(#arr-{name})"
			marker-end="url(#arr-{name})"
		/>
		<text x={g.x + g.w + g.c * 0.5 + g.fs * 0.6} y={g.cy} class="t dim" font-size={g.fs}>10x</text>

		<!-- module legend -->
		<line
			x1={g.x}
			y1={g.y + g.h + g.c * 0.55}
			x2={g.x + g.m}
			y2={g.y + g.h + g.c * 0.55}
			class="dimline"
			marker-start="url(#arr-{name})"
			marker-end="url(#arr-{name})"
		/>
		<text
			x={g.x + g.m + g.fs * 0.6}
			y={g.y + g.h + g.c * 0.55 + g.fs * 0.35}
			class="t"
			font-size={g.fs}>x = H/10 · ratio {fmt(meta.ratio)}</text
		>
	</svg>
	<figcaption class="mt-3 flex justify-between label text-ash">
		<span>{label}</span><span>Épure · module x</span>
	</figcaption>
</figure>

<style>
	.construction {
		--ink-mark: var(--color-bone);
		--line: color-mix(in oklab, var(--color-ash) 70%, transparent);
		--dim: var(--color-ember);
	}
	svg :global(*) {
		vector-effect: non-scaling-stroke;
	}
	.clear {
		fill: color-mix(in oklab, var(--color-ember) 5%, transparent);
		stroke: var(--dim);
		stroke-width: 1;
		stroke-dasharray: 6 4;
	}
	.grid {
		stroke: color-mix(in oklab, var(--color-ash) 22%, transparent);
		stroke-width: 0.5;
	}
	.axis {
		stroke: var(--line);
		stroke-width: 0.75;
		stroke-dasharray: 14 4 2 4;
	}
	.box {
		fill: none;
		stroke: var(--line);
		stroke-width: 1;
	}
	.ray {
		stroke: color-mix(in oklab, var(--color-ember) 55%, transparent);
		stroke-width: 0.6;
	}
	.circ {
		fill: none;
		stroke: var(--dim);
		stroke-width: 0.8;
		stroke-dasharray: 3 3;
	}
	.dimline {
		fill: none;
		stroke: var(--dim);
		stroke-width: 0.8;
	}
	.t {
		fill: var(--color-ash);
		font-family: var(--font-mono);
		letter-spacing: 0.08em;
	}
	.t.dim {
		fill: var(--dim);
	}
</style>
