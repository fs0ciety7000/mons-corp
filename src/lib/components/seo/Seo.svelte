<script lang="ts">
	import { jsonLd, pageSeo, type PageKey } from '#lib/seo/seo.ts';
	import { site } from '#lib/sites/config.ts';

	/** One source of truth for titles, descriptions and OG images: src/lib/seo/pages.json. */
	let { page, schema }: { page: PageKey; schema?: unknown } = $props();

	const p = $derived(pageSeo(page));
	const breadcrumbs = $derived(
		p.path === '/'
			? null
			: {
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: site.name, item: pageSeo('home').url },
						{ '@type': 'ListItem', position: 2, name: p.title.split(' — ')[0], item: p.url }
					]
				}
	);
</script>

<svelte:head>
	<title>{p.title}</title>
	<meta name="description" content={p.description} />
	<link rel="canonical" href={p.url} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="fr_BE" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:url" content={p.url} />
	<meta property="og:title" content={p.title} />
	<meta property="og:description" content={p.description} />
	<meta property="og:image" content={p.image} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={p.og.alt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={p.title} />
	<meta name="twitter:description" content={p.description} />
	<meta name="twitter:image" content={p.image} />
	<meta name="twitter:image:alt" content={p.og.alt} />
	{#if breadcrumbs}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialised JSON-LD, < escaped -->
		{@html jsonLd(breadcrumbs)}
	{/if}
	{#if schema}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialised JSON-LD, < escaped -->
		{@html jsonLd(schema)}
	{/if}
</svelte:head>
