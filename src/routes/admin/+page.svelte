<script lang="ts">
	import type { PageProps } from './$types';
	import {
		emptyCatalog,
		formatDuration,
		formatSize,
		slug,
		totalDuration,
		type Catalog,
		type Release,
		type Track
	} from '#lib/sound/catalog.ts';

	let { data, form }: PageProps = $props();

	// Working copy of the catalogue; `saved` is the last version written to R2. Login and logout
	// are plain form posts (full reload), so the initial data is read once.
	const initial = () => data.catalog ?? emptyCatalog();
	let saved = $state<Catalog>(initial());
	let draft = $state<Catalog>(structuredClone(initial()));
	let selected = $state(initial().releases[0]?.id ?? '');
	let busy = $state('');
	let notice = $state<{ kind: 'ok' | 'error'; text: string } | null>(null);
	let uploads = $state<{ id: number; name: string; pct: number }[]>([]);

	const rel = $derived(draft.releases.find((r) => r.id === selected));
	const dirty = $derived(JSON.stringify(draft.releases) !== JSON.stringify(saved.releases));
	const savedIds = $derived(new Set(saved.releases.map((r) => r.id)));
	const zipStale = $derived.by(() => {
		const s = saved.releases.find((r) => r.id === selected);
		if (!s?.download) return true;
		return false;
	});

	const say = (kind: 'ok' | 'error', text: string) => (notice = { kind, text });

	async function api<T>(url: string, method: string, body?: unknown): Promise<T> {
		const res = await fetch(url, {
			method,
			headers: { 'content-type': 'application/json' },
			body: body === undefined ? undefined : JSON.stringify(body)
		});
		if (!res.ok) {
			const msg = await res
				.json()
				.then((j: { message?: string }) => j.message)
				.catch(() => '');
			throw new Error(msg || `Erreur ${res.status}`);
		}
		return res.json() as Promise<T>;
	}

	/* ---------- Uploads (browser → R2 with a presigned PUT) ---------- */

	const EXT_TYPES: Record<string, string> = {
		mp3: 'audio/mpeg',
		ogg: 'audio/ogg',
		oga: 'audio/ogg',
		wav: 'audio/wav',
		flac: 'audio/flac',
		m4a: 'audio/mp4',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		webp: 'image/webp',
		png: 'image/png'
	};
	const typeOf = (f: File) => {
		const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
		return EXT_TYPES[ext] ?? f.type;
	};

	let seq = 0;
	async function upload(
		blob: Blob,
		name: string,
		type: string,
		release: string,
		download?: string
	): Promise<string> {
		const sign = await api<{ url: string; put: string; headers: Record<string, string> }>(
			'/admin/api/upload',
			'POST',
			{ release, name, type, size: blob.size, download }
		);
		const job = { id: ++seq, name, pct: 0 };
		uploads.push(job);
		try {
			await new Promise<void>((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open('PUT', sign.put);
				for (const [k, v] of Object.entries(sign.headers)) xhr.setRequestHeader(k, v);
				xhr.upload.onprogress = (e) => {
					const u = uploads.find((x) => x.id === job.id);
					if (u && e.lengthComputable) u.pct = Math.round((e.loaded / e.total) * 100);
				};
				xhr.onload = () =>
					xhr.status < 300 ? resolve() : reject(new Error(`Envoi refusé (${xhr.status})`));
				xhr.onerror = () => reject(new Error('Envoi interrompu'));
				xhr.send(blob);
			});
		} finally {
			uploads = uploads.filter((x) => x.id !== job.id);
		}
		return sign.url;
	}

	function duration(file: File): Promise<number> {
		return new Promise((resolve) => {
			const a = new Audio();
			const url = URL.createObjectURL(file);
			const done = (d: number) => {
				URL.revokeObjectURL(url);
				resolve(Number.isFinite(d) ? Math.round(d * 10) / 10 : 0);
			};
			a.preload = 'metadata';
			a.onloadedmetadata = () => done(a.duration);
			a.onerror = () => done(0);
			a.src = url;
		});
	}

	const titleFrom = (file: string) => {
		const t = file
			.replace(/\.[a-z0-9]+$/i, '')
			.replace(/^\s*\d{1,3}\s*[-_.\s]+/, '')
			.replace(/[_-]+/g, ' ')
			.trim();
		return t ? t[0].toUpperCase() + t.slice(1) : 'Sans titre';
	};

	function formatLabel(type: string, size: number, secs: number) {
		if (type === 'audio/mpeg' && secs > 0) {
			const kbps = Math.round((size * 8) / secs / 1000);
			const std = [128, 160, 192, 224, 256, 320].reduce((a, b) =>
				Math.abs(b - kbps) < Math.abs(a - kbps) ? b : a
			);
			return `MP3 ${std} kbit/s`;
		}
		return (
			{
				'audio/ogg': 'OGG Vorbis',
				'audio/wav': 'WAV',
				'audio/flac': 'FLAC',
				'audio/mp4': 'AAC'
			}[type] ?? 'Audio'
		);
	}

	async function addTracks(files: FileList | null) {
		if (!rel || !files?.length) return;
		const target = rel;
		busy = 'tracks';
		notice = null;
		try {
			for (const file of Array.from(files)) {
				const type = typeOf(file);
				if (!type.startsWith('audio/')) throw new Error(`${file.name} n’est pas un fichier audio`);
				const title = titleFrom(file.name);
				const n = target.tracks.length + 1;
				const secs = await duration(file);
				const url = await upload(
					file,
					file.name,
					type,
					target.id,
					`${String(n).padStart(2, '0')} - ${title}`
				);
				target.tracks.push({
					id: `${slug(title)}-${n}`,
					n,
					title,
					duration: secs,
					url,
					size: file.size,
					format: formatLabel(type, file.size, secs)
				});
			}
			say('ok', 'Pistes envoyées. Pensez à enregistrer.');
		} catch (e) {
			say('error', (e as Error).message);
		} finally {
			busy = '';
		}
	}

	async function square(file: File, size: number, type: string, quality: number) {
		const bmp = await createImageBitmap(file);
		const side = Math.min(bmp.width, bmp.height);
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = Math.min(size, side);
		const g = canvas.getContext('2d');
		if (!g) throw new Error('Canvas indisponible');
		g.imageSmoothingQuality = 'high';
		g.drawImage(
			bmp,
			(bmp.width - side) / 2,
			(bmp.height - side) / 2,
			side,
			side,
			0,
			0,
			canvas.width,
			canvas.height
		);
		bmp.close();
		return new Promise<Blob>((resolve, reject) =>
			canvas.toBlob(
				(b) => (b ? resolve(b) : reject(new Error('Conversion impossible'))),
				type,
				quality
			)
		);
	}

	async function setCover(files: FileList | null) {
		const file = files?.[0];
		if (!rel || !file) return;
		const target = rel;
		busy = 'cover';
		notice = null;
		try {
			if (!typeOf(file).startsWith('image/')) throw new Error('Choisissez une image');
			const [large, web] = await Promise.all([
				square(file, 1600, 'image/jpeg', 0.9),
				square(file, 800, 'image/webp', 0.85)
			]);
			const [largeUrl, webUrl] = await Promise.all([
				upload(large, 'cover.jpg', 'image/jpeg', target.id),
				upload(web, 'cover-800.webp', 'image/webp', target.id)
			]);
			target.cover = {
				large: largeUrl,
				web: webUrl,
				alt: target.cover?.alt || `Pochette de ${target.title}`
			};
			say('ok', 'Pochette envoyée. Pensez à enregistrer.');
		} catch (e) {
			say('error', (e as Error).message);
		} finally {
			busy = '';
		}
	}

	/* ---------- Catalogue ---------- */

	function renumber(r: Release) {
		r.tracks.forEach((t, i) => (t.n = i + 1));
	}

	function move(r: Release, i: number, by: number) {
		const j = i + by;
		if (j < 0 || j >= r.tracks.length) return;
		const [t] = r.tracks.splice(i, 1);
		r.tracks.splice(j, 0, t);
		renumber(r);
	}

	function removeTrack(r: Release, t: Track) {
		if (!confirm(`Retirer « ${t.title} » de la sortie ?`)) return;
		r.tracks = r.tracks.filter((x) => x !== t);
		renumber(r);
	}

	function addRelease() {
		const id = `sortie-${Math.random().toString(36).slice(2, 7)}`;
		draft.releases.unshift({
			id,
			title: 'Nouvelle sortie',
			kind: 'Album',
			year: new Date().getFullYear(),
			published: false,
			tracks: []
		});
		selected = id;
	}

	function removeRelease() {
		if (!rel || !confirm(`Supprimer « ${rel.title} » du catalogue ? Les fichiers restent dans R2.`))
			return;
		draft.releases = draft.releases.filter((r) => r !== rel);
		selected = draft.releases[0]?.id ?? '';
	}

	async function save() {
		busy = 'save';
		notice = null;
		try {
			const next = await api<Catalog>('/admin/api/catalog', 'PUT', $state.snapshot(draft));
			saved = next;
			draft = structuredClone(next);
			if (!draft.releases.some((r) => r.id === selected)) selected = draft.releases[0]?.id ?? '';
			say('ok', 'Catalogue enregistré. Le site est à jour.');
		} catch (e) {
			say('error', (e as Error).message);
		} finally {
			busy = '';
		}
	}

	async function rebuildZip() {
		if (!rel) return;
		busy = 'zip';
		notice = null;
		try {
			const next = await api<Catalog>('/admin/api/zip', 'POST', { release: rel.id });
			saved = next;
			draft = structuredClone(next);
			say('ok', 'Archive de l’album régénérée.');
		} catch (e) {
			say('error', (e as Error).message);
		} finally {
			busy = '';
		}
	}

	function guard(e: BeforeUnloadEvent) {
		if (dirty || uploads.length) e.preventDefault();
	}
</script>

<svelte:head>
	<title>Admin · Productions · CM Soundworks</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<svelte:window onbeforeunload={guard} />

<div class="min-h-dvh bg-void text-bone">
	<header
		class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-smoke bg-void/95 px-4 py-3 backdrop-blur md:px-8"
	>
		<p class="label">
			<a href="/" class="text-ash hover:text-bone">CM Soundworks</a>
			<span class="text-ash"> / </span>Admin · Productions
		</p>
		{#if data.authed}
			<div class="flex flex-wrap items-center gap-3">
				{#if dirty}<span class="label text-signal">● Modifications non enregistrées</span>{/if}
				<button
					type="button"
					class="btn primary"
					onclick={save}
					disabled={!dirty || !!busy || uploads.length > 0}
				>
					{busy === 'save' ? 'Enregistrement…' : 'Enregistrer'}
				</button>
				<form method="POST" action="?/logout">
					<button class="btn">Se déconnecter</button>
				</form>
			</div>
		{/if}
	</header>

	{#if !data.enabled}
		<main class="mx-auto max-w-xl px-4 py-24">
			<h1 class="font-display text-h2">Administration désactivée</h1>
			<p class="mt-4 text-ash">
				Définissez <code>SOUNDWORKS_ADMIN_PASSWORD</code> (12 caractères minimum) et
				<code>SOUNDWORKS_SESSION_SECRET</code> (32 caractères minimum) dans l’environnement de l’application.
			</p>
		</main>
	{:else if !data.authed}
		<main class="mx-auto max-w-sm px-4 py-24">
			<h1 class="font-display text-h2">Productions</h1>
			<p class="mt-2 text-ash">Espace réservé à l’équipe CM Soundworks.</p>
			<form method="POST" action="?/login" class="mt-10 space-y-4">
				<label class="block">
					<span class="label text-ash">Mot de passe</span>
					<input
						name="password"
						type="password"
						required
						autocomplete="current-password"
						class="field mt-2"
						aria-describedby={form?.message ? 'login-error' : undefined}
					/>
				</label>
				{#if form?.message}
					<p id="login-error" class="text-sm text-signal" role="alert">{form.message}</p>
				{/if}
				<button class="btn primary w-full justify-center">Se connecter</button>
			</form>
		</main>
	{:else}
		<div class="grid gap-8 px-4 py-8 md:px-8 lg:grid-cols-[18rem_1fr]">
			<aside aria-label="Sorties">
				<div class="flex items-center justify-between">
					<h2 class="label text-ash">Sorties</h2>
					<button type="button" class="btn small" onclick={addRelease}>+ Nouvelle</button>
				</div>
				{#if !data.storage}
					<p class="mt-4 text-sm text-signal">Stockage R2 non configuré : lecture seule.</p>
				{/if}
				<ul class="mt-4 space-y-1">
					{#each draft.releases as r (r.id)}
						<li>
							<button
								type="button"
								class={['rel', r.id === selected && 'is-on']}
								aria-current={r.id === selected ? 'true' : undefined}
								onclick={() => (selected = r.id)}
							>
								{#if r.cover}<img
										src={r.cover.web}
										alt=""
										class="size-10 object-cover"
									/>{:else}<span class="size-10 border border-dashed border-smoke"></span>{/if}
								<span class="min-w-0 flex-1 text-left">
									<span class="block truncate">{r.title}</span>
									<span class="block label text-ash"
										>{r.published ? 'Publiée' : 'Brouillon'} · {r.tracks.length} pistes</span
									>
								</span>
							</button>
						</li>
					{:else}
						<li class="text-sm text-ash">Aucune sortie. Créez la première.</li>
					{/each}
				</ul>
			</aside>

			<main>
				<div aria-live="polite" class="min-h-6">
					{#if notice}
						<p class={['notice', notice.kind]}>{notice.text}</p>
					{/if}
					{#each uploads as u (u.id)}
						<p class="label text-ash">Envoi de {u.name} · {u.pct} %</p>
					{/each}
				</div>

				{#if rel}
					<h1 class="mt-4 font-display text-h2">{rel.title || 'Sans titre'}</h1>

					<div class="mt-8 grid gap-8 xl:grid-cols-[1fr_20rem]">
						<section class="space-y-5" aria-label="Informations">
							<div class="grid gap-5 sm:grid-cols-2">
								<label class="block sm:col-span-2">
									<span class="label text-ash">Titre</span>
									<input class="field mt-2" bind:value={rel.title} required maxlength="120" />
								</label>
								<label class="block sm:col-span-2">
									<span class="label text-ash">Sous-titre</span>
									<input
										class="field mt-2"
										bind:value={rel.subtitle}
										placeholder="Bande originale du jeu"
										maxlength="160"
									/>
								</label>
								<label class="block">
									<span class="label text-ash">Type</span>
									<input class="field mt-2" bind:value={rel.kind} list="kinds" maxlength="30" />
									<datalist id="kinds">
										<option value="OST"></option>
										<option value="Album"></option>
										<option value="EP"></option>
										<option value="Single"></option>
										<option value="Sound design"></option>
										<option value="Doublage"></option>
									</datalist>
								</label>
								<label class="block">
									<span class="label text-ash">Année</span>
									<input
										class="field mt-2"
										type="number"
										min="2000"
										max="2100"
										bind:value={rel.year}
									/>
								</label>
								<label class="block sm:col-span-2">
									<span class="label text-ash">Identifiant (adresse des fichiers)</span>
									<input
										class="field mt-2 font-mono"
										value={rel.id}
										onchange={(e) => {
											// Rename and keep the selection in one step (the editor follows `selected`).
											const r = rel;
											const id = slug(e.currentTarget.value);
											if (!r || draft.releases.some((x) => x !== r && x.id === id)) {
												e.currentTarget.value = r?.id ?? '';
												return;
											}
											r.id = id;
											selected = id;
											e.currentTarget.value = id;
										}}
										readonly={savedIds.has(rel.id)}
										aria-describedby="id-help"
									/>
									<span id="id-help" class="mt-1 block text-xs text-ash"
										>{savedIds.has(rel.id)
											? 'Figé après le premier enregistrement.'
											: 'Choisissez-le avant d’envoyer des fichiers.'}</span
									>
								</label>
							</div>
							<label class="block">
								<span class="label text-ash">Description</span>
								<textarea class="field mt-2 min-h-32" bind:value={rel.description} maxlength="2000"
								></textarea>
							</label>
							<label class="block">
								<span class="label text-ash">Crédits</span>
								<textarea class="field mt-2 min-h-20" bind:value={rel.credits} maxlength="600"
								></textarea>
							</label>
							<fieldset class="grid gap-5 border border-smoke p-4 sm:grid-cols-3">
								<legend class="px-2 label text-ash">Projet lié</legend>
								<label class="block">
									<span class="label text-ash">Nom</span>
									<input
										class="field mt-2"
										value={rel.project?.name ?? ''}
										oninput={(e) =>
											(rel.project = { ...(rel.project ?? {}), name: e.currentTarget.value })}
									/>
								</label>
								<label class="block">
									<span class="label text-ash">Adresse (https)</span>
									<input
										class="field mt-2"
										type="url"
										value={rel.project?.url ?? ''}
										oninput={(e) =>
											(rel.project = {
												name: rel.project?.name ?? '',
												...rel.project,
												url: e.currentTarget.value
											})}
									/>
								</label>
								<label class="block">
									<span class="label text-ash">Studio</span>
									<input
										class="field mt-2"
										value={rel.project?.studio ?? ''}
										oninput={(e) =>
											(rel.project = {
												name: rel.project?.name ?? '',
												...rel.project,
												studio: e.currentTarget.value
											})}
									/>
								</label>
							</fieldset>
							<label class="flex min-h-11 items-center gap-3">
								<input
									type="checkbox"
									class="size-5 accent-[var(--color-signal)]"
									bind:checked={rel.published}
								/>
								<span>Publiée sur sound.cardormedia.com</span>
							</label>
						</section>

						<section aria-label="Pochette" class="max-w-sm space-y-4">
							<h2 class="label text-ash">Pochette</h2>
							<div class="aspect-square border border-smoke bg-ink">
								{#if rel.cover}
									<img src={rel.cover.web} alt={rel.cover.alt} class="size-full object-cover" />
								{:else}
									<p class="grid size-full place-items-center p-6 text-center text-sm text-ash">
										Image carrée conseillée (1600 px ou plus). Elle est recadrée au centre.
									</p>
								{/if}
							</div>
							<label class="btn w-full justify-center" aria-disabled={!data.storage || !!busy}>
								{busy === 'cover'
									? 'Envoi…'
									: rel.cover
										? 'Remplacer l’image'
										: 'Choisir une image'}
								<input
									type="file"
									accept="image/jpeg,image/png,image/webp"
									class="sr-only"
									disabled={!data.storage || !!busy}
									onchange={(e) => {
										setCover(e.currentTarget.files);
										e.currentTarget.value = '';
									}}
								/>
							</label>
							{#if rel.cover}
								<label class="block">
									<span class="label text-ash">Texte alternatif</span>
									<textarea class="field mt-2 min-h-20" bind:value={rel.cover.alt} maxlength="300"
									></textarea>
								</label>
							{/if}
						</section>
					</div>

					<section class="mt-12" aria-labelledby="tracks-title">
						<div class="flex flex-wrap items-center justify-between gap-3">
							<h2 id="tracks-title" class="label text-ash">
								Pistes · {rel.tracks.length} · {formatDuration(totalDuration(rel))}
							</h2>
							<label class="btn" aria-disabled={!data.storage || !!busy}>
								{busy === 'tracks' ? 'Envoi…' : '+ Ajouter des pistes'}
								<input
									type="file"
									accept="audio/*,.mp3,.ogg,.wav,.flac,.m4a"
									multiple
									class="sr-only"
									disabled={!data.storage || !!busy}
									onchange={(e) => {
										addTracks(e.currentTarget.files);
										e.currentTarget.value = '';
									}}
								/>
							</label>
						</div>
						<p class="mt-2 text-xs text-ash">
							MP3 320 kbit/s conseillé. L’ordre d’envoi donne la numérotation ; le nom du fichier
							proposé au téléchargement est fixé à l’envoi.
						</p>
						<ol class="mt-4 border-t border-smoke">
							{#each rel.tracks as t, i (t.id)}
								<li
									class="grid gap-3 border-b border-smoke py-3 md:grid-cols-[2.5rem_1fr_1fr_auto]"
								>
									<span class="pt-3 font-mono text-xs text-ash">{String(t.n).padStart(2, '0')}</span
									>
									<label class="block">
										<span class="sr-only">Titre de la piste {t.n}</span>
										<input class="field" bind:value={t.title} maxlength="160" />
									</label>
									<label class="block">
										<span class="sr-only">Note de la piste {t.n}</span>
										<input
											class="field"
											bind:value={t.note}
											placeholder="Contexte (écran, ambiance…)"
											maxlength="240"
										/>
									</label>
									<div class="flex items-center gap-1">
										<span class="mr-2 font-mono text-xs whitespace-nowrap text-ash"
											>{formatDuration(t.duration)} · {formatSize(t.size)}</span
										>
										<button
											type="button"
											class="icon-btn"
											onclick={() => move(rel, i, -1)}
											disabled={i === 0}
											aria-label="Monter {t.title}">↑</button
										>
										<button
											type="button"
											class="icon-btn"
											onclick={() => move(rel, i, 1)}
											disabled={i === rel.tracks.length - 1}
											aria-label="Descendre {t.title}">↓</button
										>
										<a
											href={t.url}
											target="_blank"
											rel="noopener"
											class="icon-btn"
											aria-label="Écouter {t.title}">▶</a
										>
										<button
											type="button"
											class="icon-btn"
											onclick={() => removeTrack(rel, t)}
											aria-label="Retirer {t.title}">✕</button
										>
									</div>
								</li>
							{:else}
								<li class="py-6 text-sm text-ash">Aucune piste pour l’instant.</li>
							{/each}
						</ol>
					</section>

					<section class="mt-12 border border-smoke p-4 md:p-6" aria-labelledby="zip-title">
						<h2 id="zip-title" class="label text-ash">Téléchargement de l’album</h2>
						{#if rel.download}
							<p class="mt-3 text-sm">
								<a href={rel.download.url} class="underline underline-offset-4">Archive actuelle</a>
								· {formatSize(rel.download.size)}
							</p>
							<label class="mt-4 block">
								<span class="label text-ash">Libellé</span>
								<input class="field mt-2" bind:value={rel.download.label} maxlength="120" />
							</label>
						{:else}
							<p class="mt-3 text-sm text-ash">Pas encore d’archive.</p>
						{/if}
						<p class="mt-4 text-xs text-ash">
							Après avoir ajouté, retiré ou réordonné des pistes : enregistrez, puis régénérez
							l’archive (pistes et pochette, sans recompression).
						</p>
						<button
							type="button"
							class="btn mt-4"
							onclick={rebuildZip}
							disabled={dirty ||
								!!busy ||
								!data.storage ||
								!savedIds.has(rel.id) ||
								!rel.tracks.length}
						>
							{busy === 'zip'
								? 'Création de l’archive…'
								: zipStale
									? 'Créer l’archive ZIP'
									: 'Régénérer l’archive ZIP'}
						</button>
						{#if dirty}<p class="mt-2 text-xs text-ash">
								Enregistrez d’abord vos modifications.
							</p>{/if}
					</section>

					<div class="mt-12 border-t border-smoke pt-6">
						<button type="button" class="btn danger" onclick={removeRelease}
							>Supprimer cette sortie</button
						>
					</div>
				{:else}
					<p class="mt-8 text-ash">Sélectionnez ou créez une sortie.</p>
				{/if}
			</main>
		</div>
	{/if}
</div>

<style>
	.field {
		width: 100%;
		min-height: 2.75rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		color: var(--color-bone);
		font-size: 1rem;
	}
	.field:focus-visible {
		outline: 2px solid var(--color-signal);
		outline-offset: 1px;
		border-color: transparent;
	}
	.field[readonly] {
		color: var(--color-ash);
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		padding: 0 1.1rem;
		border: 1px solid var(--color-smoke);
		border-radius: 999px;
		cursor: pointer;
		transition:
			border-color 0.3s,
			background-color 0.3s,
			color 0.3s;
	}
	.btn:hover {
		border-color: var(--color-signal);
	}
	.btn:focus-visible,
	.btn:focus-within,
	.rel:focus-visible,
	.icon-btn:focus-visible {
		outline: 2px solid var(--color-signal);
		outline-offset: 2px;
	}
	.btn.small {
		min-height: 2.25rem;
		padding: 0 0.8rem;
		font-size: 0.875rem;
	}
	.btn.primary {
		background: var(--color-bone);
		border-color: var(--color-bone);
		color: var(--color-void);
		font-weight: 500;
	}
	.btn.primary:hover {
		background: var(--color-signal);
		border-color: var(--color-signal);
	}
	.btn.danger:hover {
		border-color: var(--color-ember);
		color: var(--color-ember);
	}
	.btn:disabled,
	.btn[aria-disabled='true'] {
		opacity: 0.45;
		pointer-events: none;
	}
	.rel {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		border: 1px solid transparent;
	}
	.rel:hover {
		background: var(--color-ink);
	}
	.rel.is-on {
		border-color: var(--color-smoke);
		background: var(--color-ink);
	}
	.icon-btn {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		color: var(--color-ash);
	}
	.icon-btn:hover {
		color: var(--color-bone);
	}
	.icon-btn:disabled {
		opacity: 0.3;
	}
	.notice {
		padding: 0.75rem 1rem;
		border-left: 2px solid var(--color-signal);
		background: var(--color-ink);
	}
	.notice.error {
		border-color: var(--color-ember);
	}
</style>
