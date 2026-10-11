import type { CoreStateId } from '#lib/data/divisions.ts';

/**
 * Shared state between the DOM and the WebGL "Core" (ADR-007).
 * Components write `active`; CoreCanvas reads it and tweens uniforms.
 */
export const core = $state({
	/** Which state the Core is morphing towards. */
	active: 'holding' as CoreStateId,
	/** True once the preloader has finished and the intro may play. */
	ready: false,
	/** Audio level 0–1 injected by CM Soundworks' generative drone. */
	audio: 0,
	/** Which source owns the speakers on CM Soundworks: one at a time (ADR-013). */
	soundOwner: null as 'drone' | 'player' | null,
	/** Set when WebGL failed — UI switches to the CSS fallback. */
	webglFailed: false
});

export function setCoreState(id: CoreStateId) {
	core.active = id;
}
