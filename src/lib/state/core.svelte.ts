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
	/** Set when WebGL failed — UI switches to the CSS fallback. */
	webglFailed: false
});

export function setCoreState(id: CoreStateId) {
	core.active = id;
}
