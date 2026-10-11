import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	checkPassword,
	clearFailures,
	clientKey,
	closeSession,
	isAdmin,
	openSession,
	recordFailure,
	throttled
} from '#lib/server/admin-auth.ts';
import { readCatalog } from '#lib/server/sound-catalog.ts';
import { r2Config } from '#lib/server/r2.ts';

export const load: PageServerLoad = async ({ cookies }) => {
	if (!isAdmin(cookies)) return { catalog: null, storage: false };
	return { catalog: await readCatalog({ fresh: true }), storage: r2Config() !== null };
};

export const actions: Actions = {
	login: async (event) => {
		const key = clientKey(event);
		if (throttled(key)) return fail(429, { message: 'Trop d’essais. Réessayez dans 15 minutes.' });
		const form = await event.request.formData();
		const password = String(form.get('password') ?? '');
		if (!checkPassword(password)) {
			recordFailure(key);
			return fail(401, { message: 'Mot de passe incorrect.' });
		}
		clearFailures(key);
		openSession(event.cookies);
		redirect(303, '/admin');
	},
	logout: ({ cookies }) => {
		closeSession(cookies);
		redirect(303, '/admin');
	}
};
