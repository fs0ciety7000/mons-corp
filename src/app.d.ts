// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	/** Target site, fixed at build time (ADR-008). */
	const __SITE__: 'holding' | 'interactive' | 'sound' | 'creative' | 'apps';
	const __DEPLOY_ENV__: 'production' | 'staging';

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
