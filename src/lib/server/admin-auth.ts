/**
 * Single-password admin of CM Soundworks (ADR-013): HMAC-signed session cookie, login rate limit,
 * same-origin check on the JSON endpoints. Disabled unless both secrets are set at runtime.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { error, type Cookies, type RequestEvent } from '@sveltejs/kit';

export const COOKIE = 'sw_admin';
const MAX_AGE = 12 * 3600;

const secrets = () => {
	const password = process.env.SOUNDWORKS_ADMIN_PASSWORD ?? '';
	const secret = process.env.SOUNDWORKS_SESSION_SECRET ?? '';
	return password.length >= 12 && secret.length >= 32 ? { password, secret } : null;
};

export const adminEnabled = () => secrets() !== null;

const digest = (s: string) => createHash('sha256').update(s).digest();
const sig = (secret: string, payload: string) =>
	createHmac('sha256', secret).update(payload).digest('base64url');

export function checkPassword(input: string) {
	const s = secrets();
	return !!s && timingSafeEqual(digest(input), digest(s.password));
}

export function openSession(cookies: Cookies) {
	const s = secrets();
	if (!s) return;
	const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
	cookies.set(COOKIE, `${exp}.${sig(s.secret, `sw:${exp}`)}`, {
		path: '/admin',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: MAX_AGE
	});
}

export const closeSession = (cookies: Cookies) => cookies.delete(COOKIE, { path: '/admin' });

export function isAdmin(cookies: Cookies) {
	const s = secrets();
	const raw = cookies.get(COOKIE);
	if (!s || !raw) return false;
	const [exp, mac] = raw.split('.');
	if (!exp || !mac || Number(exp) * 1000 < Date.now()) return false;
	const want = Buffer.from(sig(s.secret, `sw:${exp}`));
	const got = Buffer.from(mac);
	return want.length === got.length && timingSafeEqual(want, got);
}

/** Guard for the admin JSON endpoints: valid session and a same-origin request. */
export function requireAdmin({ cookies, request, url }: RequestEvent) {
	if (!isAdmin(cookies)) error(401, 'Session expirée');
	if (request.method !== 'GET' && request.headers.get('origin') !== url.origin) {
		error(403, 'Origine refusée');
	}
}

/* Login throttling: 5 failures per address per 15 min, and a global ceiling. */
const WINDOW = 15 * 60_000;
const failures = new Map<string, { n: number; since: number }>();
let global = { n: 0, since: Date.now() };

export function clientKey(event: RequestEvent) {
	const h = event.request.headers;
	const xff = h.get('x-forwarded-for')?.split(',').at(-1)?.trim();
	return h.get('cf-connecting-ip') ?? xff ?? event.getClientAddress();
}

export function throttled(key: string) {
	const now = Date.now();
	if (now - global.since > WINDOW) global = { n: 0, since: now };
	const f = failures.get(key);
	if (f && now - f.since > WINDOW) failures.delete(key);
	return (failures.get(key)?.n ?? 0) >= 5 || global.n >= 60;
}

export function recordFailure(key: string) {
	const now = Date.now();
	const f = failures.get(key);
	failures.set(
		key,
		f && now - f.since <= WINDOW ? { n: f.n + 1, since: f.since } : { n: 1, since: now }
	);
	global.n++;
	if (failures.size > 5000) failures.clear();
}

export const clearFailures = (key: string) => failures.delete(key);
