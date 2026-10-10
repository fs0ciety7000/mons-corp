import type { CoreStateId } from '#lib/data/divisions.ts';

export interface CoreParams {
	color: string;
	noiseFreq: number;
	noiseAmp: number;
	facet: number;
	pulse: number;
	flow: number;
}

/** The four states of the Core — docs/motion-agent-report.md §4.2 */
export const coreStates: Record<CoreStateId, CoreParams> = {
	holding: { color: '#FF3B1F', noiseFreq: 1.1, noiseAmp: 0.28, facet: 0, pulse: 0, flow: 0.35 },
	interactive: { color: '#C6FF3D', noiseFreq: 2.4, noiseAmp: 0.22, facet: 1, pulse: 0, flow: 0.2 },
	sound: { color: '#7B5CFF', noiseFreq: 0.9, noiseAmp: 0.18, facet: 0, pulse: 1, flow: 0.15 },
	creative: { color: '#FFB547', noiseFreq: 0.7, noiseAmp: 0.45, facet: 0, pulse: 0, flow: 1 }
};

/** Hex → linear-free RGB triplet in [0, 1] (shaders work in display space). */
export function hexToRgb(hex: string): [number, number, number] {
	const n = parseInt(hex.replace('#', ''), 16);
	return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
