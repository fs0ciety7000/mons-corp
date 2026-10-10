<script lang="ts">
	import DivisionHero from '#lib/sites/division/DivisionHero.svelte';
	import Statement from '#lib/sites/division/Statement.svelte';
	import Offer from '#lib/sites/division/Offer.svelte';
	import Method from '#lib/sites/division/Method.svelte';
	import EmblemStory from '#lib/sites/division/EmblemStory.svelte';
	import Sisters from '#lib/sites/division/Sisters.svelte';
	import Marquee from '#lib/components/sections/Marquee.svelte';
	import Projects from './Projects.svelte';
	import { content } from './content.ts';
</script>

<DivisionHero hero={content.hero}>
	{#snippet signature()}
		<span class="label text-ash">[ PRESS START ]</span>
	{/snippet}
</DivisionHero>
<Statement index="01" label={content.statement.label} html={content.statement.html} />
<Marquee words={content.marquee} />
<Offer index="02" offer={content.offer} />
<Projects index="03" />
<Method index="04" method={content.method} />
<EmblemStory index="05" emblem={content.emblem} />
<Sisters />
