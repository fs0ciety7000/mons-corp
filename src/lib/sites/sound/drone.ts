/**
 * OCC Soundworks — generative "carillon" drone (docs/sites/soundworks.md).
 * No audio file: a fifths drone through a slowly breathing low-pass filter, with
 * occasional bell partials in A minor pentatonic, like the 49 bells of the Mons belfry.
 * The AudioContext is created on an explicit user gesture only.
 */
export class Drone {
	private ctx: AudioContext | null = null;
	private master: GainNode | null = null;
	private analyser: AnalyserNode | null = null;
	private data: Uint8Array<ArrayBuffer> | null = null;
	private nodes: AudioScheduledSourceNode[] = [];
	private bellTimer: ReturnType<typeof setTimeout> | null = null;
	playing = false;

	async start() {
		if (this.playing) return;
		const ctx = this.ctx ?? new AudioContext();
		this.ctx = ctx;
		await ctx.resume();

		const master = ctx.createGain();
		master.gain.value = 0;
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 512;
		master.connect(analyser).connect(ctx.destination);
		this.master = master;
		this.analyser = analyser;
		this.data = new Uint8Array(new ArrayBuffer(analyser.fftSize));

		const filter = ctx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.value = 520;
		filter.Q.value = 6;
		filter.connect(master);

		// Breathing filter: a very slow LFO on the cutoff.
		const lfo = ctx.createOscillator();
		lfo.frequency.value = 0.07;
		const lfoDepth = ctx.createGain();
		lfoDepth.gain.value = 380;
		lfo.connect(lfoDepth).connect(filter.frequency);
		lfo.start();
		this.nodes.push(lfo);

		// A1 · E2 · A2 · E3, gently detuned.
		for (const [f, type, g] of [
			[55, 'sine', 0.5],
			[82.41, 'triangle', 0.22],
			[110.3, 'sawtooth', 0.06],
			[164.6, 'triangle', 0.08]
		] as const) {
			const o = ctx.createOscillator();
			o.type = type;
			o.frequency.value = f;
			o.detune.value = (Math.random() - 0.5) * 12;
			const gain = ctx.createGain();
			gain.gain.value = g;
			o.connect(gain).connect(filter);
			o.start();
			this.nodes.push(o);
		}

		master.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 2);
		this.playing = true;
		this.scheduleBell();
	}

	/** One bell stroke: inharmonic partials with exponential decay. */
	private bell() {
		const ctx = this.ctx;
		if (!ctx || !this.master) return;
		const notes = [440, 523.25, 587.33, 659.25, 783.99, 880];
		const base = notes[(Math.random() * notes.length) | 0];
		const t = ctx.currentTime;
		for (const [ratio, amp, decay] of [
			[1, 0.12, 3.2],
			[2.01, 0.05, 2.2],
			[2.76, 0.035, 1.6],
			[5.4, 0.015, 0.9]
		]) {
			const o = ctx.createOscillator();
			o.frequency.value = base * ratio;
			const g = ctx.createGain();
			g.gain.setValueAtTime(0, t);
			g.gain.linearRampToValueAtTime(amp, t + 0.01);
			g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
			o.connect(g).connect(this.master);
			o.start(t);
			o.stop(t + decay + 0.1);
		}
	}

	private scheduleBell() {
		if (!this.playing) return;
		this.bellTimer = setTimeout(
			() => {
				this.bell();
				this.scheduleBell();
			},
			2200 + Math.random() * 4200
		);
	}

	/** RMS level, roughly 0–1. */
	level(): number {
		if (!this.analyser || !this.data) return 0;
		this.analyser.getByteTimeDomainData(this.data);
		let sum = 0;
		for (const v of this.data) {
			const x = (v - 128) / 128;
			sum += x * x;
		}
		return Math.min(1, Math.sqrt(sum / this.data.length) * 4);
	}

	stop() {
		if (!this.playing || !this.ctx || !this.master) return;
		this.playing = false;
		if (this.bellTimer) clearTimeout(this.bellTimer);
		const t = this.ctx.currentTime;
		this.master.gain.cancelScheduledValues(t);
		this.master.gain.setValueAtTime(this.master.gain.value, t);
		this.master.gain.linearRampToValueAtTime(0, t + 1.2);
		const nodes = this.nodes;
		this.nodes = [];
		setTimeout(() => nodes.forEach((n) => n.stop()), 1300);
	}

	dispose() {
		this.stop();
		setTimeout(() => this.ctx?.close(), 1400);
	}
}
