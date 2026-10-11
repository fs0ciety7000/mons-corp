/**
 * The CM Soundworks album player (ADR-013): one <audio> element for the whole site, analysed so
 * the Core and the waveform react to the music like they do to the generative drone.
 */
import { core } from '#lib/state/core.svelte.ts';
import type { Release } from './catalog.ts';

export const player = $state({
	release: null as Release | null,
	index: -1,
	playing: false,
	loading: false,
	time: 0,
	duration: 0,
	error: ''
});

let audio: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let samples: Uint8Array<ArrayBuffer> | null = null;

export const current = () => player.release?.tracks[player.index] ?? null;

function element() {
	if (audio) return audio;
	const a = new Audio();
	// CORS is required to analyse a cross-origin stream (media.cardormedia.com allows our origins).
	a.crossOrigin = 'anonymous';
	a.preload = 'metadata';
	a.addEventListener('play', () => (player.playing = true));
	a.addEventListener('pause', () => (player.playing = false));
	a.addEventListener('waiting', () => (player.loading = true));
	a.addEventListener('playing', () => (player.loading = false));
	a.addEventListener('canplay', () => (player.loading = false));
	a.addEventListener('durationchange', () => {
		if (Number.isFinite(a.duration)) player.duration = a.duration;
	});
	a.addEventListener('ended', () => {
		if (player.release && player.index < player.release.tracks.length - 1) next();
		else player.playing = false;
	});
	a.addEventListener('error', () => {
		player.loading = false;
		player.playing = false;
		player.error = 'Lecture impossible pour le moment.';
	});
	audio = a;
	return a;
}

function graph(a: HTMLAudioElement) {
	if (ctx) return;
	try {
		ctx = new AudioContext();
		const src = ctx.createMediaElementSource(a);
		analyser = ctx.createAnalyser();
		analyser.fftSize = 512;
		analyser.smoothingTimeConstant = 0.75;
		samples = new Uint8Array(analyser.fftSize);
		src.connect(analyser);
		analyser.connect(ctx.destination);
	} catch {
		// No Web Audio: the music still plays, the Core simply does not react.
		analyser = null;
	}
}

function mediaSession() {
	const t = current();
	const r = player.release;
	if (!t || !r || !('mediaSession' in navigator)) return;
	navigator.mediaSession.metadata = new MediaMetadata({
		title: t.title,
		artist: 'CM Soundworks',
		album: [r.title, r.subtitle].filter(Boolean).join(' — '),
		artwork: r.cover
			? [
					{ src: r.cover.web, sizes: '800x800', type: 'image/webp' },
					{ src: r.cover.large, sizes: '1600x1600', type: 'image/jpeg' }
				]
			: []
	});
	const on = (a: MediaSessionAction, fn: MediaSessionActionHandler) => {
		try {
			navigator.mediaSession.setActionHandler(a, fn);
		} catch {
			/* unsupported action */
		}
	};
	on('play', () => resume());
	on('pause', () => pause());
	on('previoustrack', () => prev());
	on('nexttrack', () => next());
	on('seekto', (d) => d.seekTime !== undefined && seek(d.seekTime));
}

/** Play track `index` of `release` (or toggle it when it is already the current one). */
export async function play(release: Release, index = 0) {
	const a = element();
	graph(a);
	const same = player.release?.id === release.id && player.index === index;
	if (same) {
		if (a.paused) await resume();
		else pause();
		return;
	}
	const t = release.tracks[index];
	if (!t) return;
	player.release = release;
	player.index = index;
	player.time = 0;
	player.duration = t.duration;
	player.error = '';
	player.loading = true;
	a.src = t.url;
	mediaSession();
	await resume();
}

export async function resume() {
	const a = element();
	if (!a.src) return;
	core.soundOwner = 'player';
	try {
		await ctx?.resume();
		await a.play();
	} catch (e) {
		// AbortError = superseded by another play(); anything else is worth telling the listener.
		if ((e as DOMException).name !== 'AbortError') {
			player.loading = false;
			player.error = 'Lecture impossible pour le moment.';
		}
	}
}

export function pause() {
	audio?.pause();
}

export const toggle = () => (audio && !audio.paused ? pause() : resume());

export function next() {
	const r = player.release;
	if (r && player.index < r.tracks.length - 1) play(r, player.index + 1);
}

export function prev() {
	const r = player.release;
	if (!r) return;
	// Like any player: back to the start first, previous track on a second press.
	if ((audio?.currentTime ?? 0) > 3 || player.index === 0) seek(0);
	else play(r, player.index - 1);
}

export function seek(t: number) {
	if (!audio) return;
	audio.currentTime = Math.max(0, Math.min(t, player.duration || t));
	player.time = audio.currentTime;
}

export function close() {
	pause();
	if (audio) {
		audio.removeAttribute('src');
		audio.load();
	}
	player.release = null;
	player.index = -1;
	player.time = 0;
	if (core.soundOwner === 'player') core.soundOwner = null;
}

/** Called on the GSAP ticker: playback position and an RMS level (0–1) for the Core. */
export function sample(): number {
	if (!audio) return 0;
	player.time = audio.currentTime;
	if (!analyser || !samples || audio.paused) return 0;
	analyser.getByteTimeDomainData(samples);
	let sum = 0;
	for (let i = 0; i < samples.length; i++) {
		const v = (samples[i] - 128) / 128;
		sum += v * v;
	}
	return Math.min(1, Math.sqrt(sum / samples.length) * 3.2);
}

export function dispose() {
	close();
	ctx?.close();
	ctx = null;
	analyser = null;
	audio = null;
}
