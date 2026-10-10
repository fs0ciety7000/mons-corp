<script lang="ts">
	import DivisionHero from '#lib/sites/division/DivisionHero.svelte';
	import Statement from '#lib/sites/division/Statement.svelte';
	import Offer from '#lib/sites/division/Offer.svelte';
	import Method from '#lib/sites/division/Method.svelte';
	import EmblemStory from '#lib/sites/division/EmblemStory.svelte';
	import Sisters from '#lib/sites/division/Sisters.svelte';
	import Soon from '#lib/sites/division/Soon.svelte';
	import Marquee from '#lib/components/sections/Marquee.svelte';
	import Listen from './Listen.svelte';
	import Wave from './Wave.svelte';
	import { content } from './content.ts';
</script>

<DivisionHero hero={content.hero}>
	{#snippet signature()}
		<Listen />
	{/snippet}
</DivisionHero>
<div class="-mt-16 mb-8 md:-mt-24"><Wave /></div>
<Statement index="01" label={content.statement.label} html={content.statement.html} />
<Marquee words={content.marquee} />
<Offer index="02" offer={content.offer} />
<Method index="03" method={content.method} />
<EmblemStory index="04" emblem={content.emblem} />
{#if content.soon}<Soon index="05" soon={content.soon} />{/if}
<Sisters />
