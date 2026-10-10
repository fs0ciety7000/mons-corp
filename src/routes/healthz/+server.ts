import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = () =>
	new Response('ok', { headers: { 'content-type': 'text/plain', 'cache-control': 'no-store' } });
