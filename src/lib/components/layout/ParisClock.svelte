<script lang="ts">
	import { onMount } from 'svelte';
	import { site } from '#lib/data/site.ts';

	let time = $state('--:--:--');

	onMount(() => {
		const fmt = new Intl.DateTimeFormat('fr-FR', {
			timeZone: site.timezone,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		const update = () => (time = fmt.format(new Date()));
		update();
		const id = setInterval(update, 1000);
		return () => clearInterval(id);
	});
</script>

<span class="label tabular-nums"><span class="text-ash">PAR</span>&nbsp;{time}</span>
