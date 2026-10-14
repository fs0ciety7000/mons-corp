import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { existsSync } from 'node:fs';
import { projectErrors, projects } from './src/lib/data/projects.ts';

// ADR-008: one codebase, five sites (ADR-012 adds the app launcher). The target site is fixed at build time.
const SITES = ['holding', 'interactive', 'sound', 'creative', 'publishing', 'apps'];
const site = process.env.PUBLIC_SITE ?? 'holding';
if (!SITES.includes(site)) throw new Error(`PUBLIC_SITE must be one of ${SITES.join(', ')}`);
const deployEnv = process.env.PUBLIC_DEPLOY_ENV === 'staging' ? 'staging' : 'production';

/** Every project of src/lib/data/projects.ts must be complete and have its icon and cover. */
const checkProjects = (): Plugin => ({
	name: 'cardor:check-projects',
	buildStart() {
		const errors = projectErrors(projects, (path) => existsSync(`static${path}`));
		if (errors.length)
			this.error(`Invalid projects (src/lib/data/projects.ts):\n${errors.join('\n')}`);
	}
});

export default defineConfig({
	define: {
		__SITE__: JSON.stringify(site),
		__DEPLOY_ENV__: JSON.stringify(deployEnv)
	},
	// three.js is lazy-loaded by the hero and weighs ~540 kB on its own.
	build: { chunkSizeWarningLimit: 650 },
	plugins: [
		checkProjects(),
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
