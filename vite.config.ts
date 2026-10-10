import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// ADR-008: one codebase, four sites. The target site is fixed at build time.
const SITES = ['holding', 'interactive', 'sound', 'creative'];
const site = process.env.PUBLIC_SITE ?? 'holding';
if (!SITES.includes(site)) throw new Error(`PUBLIC_SITE must be one of ${SITES.join(', ')}`);
const deployEnv = process.env.PUBLIC_DEPLOY_ENV === 'staging' ? 'staging' : 'production';

export default defineConfig({
	define: {
		__SITE__: JSON.stringify(site),
		__DEPLOY_ENV__: JSON.stringify(deployEnv)
	},
	// three.js is lazy-loaded by the hero and weighs ~540 kB on its own.
	build: { chunkSizeWarningLimit: 650 },
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		})
	]
});
