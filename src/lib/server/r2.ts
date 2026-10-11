/**
 * Minimal Cloudflare R2 client (S3 API, SigV4) on node:crypto — no SDK dependency (ADR-013).
 * Credentials come from the runtime environment of the sound site only.
 */
import { createHash, createHmac } from 'node:crypto';

// Read at call time: adapter-node exposes the container's runtime environment.
const env = process.env;
const REGION = 'auto';
const SERVICE = 's3';

interface R2Config {
	account: string;
	key: string;
	secret: string;
	bucket: string;
	media: string;
}

export function r2Config(): R2Config | null {
	const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = env;
	if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null;
	return {
		account: R2_ACCOUNT_ID,
		key: R2_ACCESS_KEY_ID,
		secret: R2_SECRET_ACCESS_KEY,
		bucket: env.R2_BUCKET || 'cardor-media',
		media: (process.env.MEDIA_BASE_URL || 'https://media.cardormedia.com').replace(/\/+$/, '')
	};
}

const need = () => {
	const c = r2Config();
	if (!c) throw new Error('R2 non configuré');
	return c;
};

/** Public URL of an object, served by the bucket's custom domain. */
export const publicUrl = (key: string) => `${need().media}/${encodeKey(key)}`;

const rfc3986 = (s: string) =>
	encodeURIComponent(s).replace(
		/[!'()*]/g,
		(c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
	);
const encodeKey = (key: string) => key.split('/').map(rfc3986).join('/');

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const hmac = (k: Buffer | string, s: string) => createHmac('sha256', k).update(s).digest();

function signingKey(secret: string, date: string) {
	return hmac(hmac(hmac(hmac(`AWS4${secret}`, date), REGION), SERVICE), 'aws4_request');
}

const stamp = (d = new Date()) =>
	d
		.toISOString()
		.replace(/[-:]/g, '')
		.replace(/\.\d{3}/, '');

interface Signed {
	url: string;
	headers: Record<string, string>;
}

function sign(
	method: string,
	key: string,
	opts: { headers?: Record<string, string>; query?: Record<string, string>; presign?: number } = {}
): Signed {
	const c = need();
	const host = `${c.account}.r2.cloudflarestorage.com`;
	const path = `/${c.bucket}/${encodeKey(key)}`;
	const amzDate = stamp();
	const date = amzDate.slice(0, 8);
	const scope = `${date}/${REGION}/${SERVICE}/aws4_request`;

	const headers: Record<string, string> = { host };
	for (const [k, v] of Object.entries(opts.headers ?? {})) headers[k.toLowerCase()] = v.trim();
	if (!opts.presign) {
		headers['x-amz-date'] = amzDate;
		headers['x-amz-content-sha256'] = 'UNSIGNED-PAYLOAD';
	}
	const names = Object.keys(headers).sort();
	const signedHeaders = names.join(';');

	const query: Record<string, string> = { ...(opts.query ?? {}) };
	if (opts.presign) {
		Object.assign(query, {
			'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
			'X-Amz-Credential': `${c.key}/${scope}`,
			'X-Amz-Date': amzDate,
			'X-Amz-Expires': String(opts.presign),
			'X-Amz-SignedHeaders': signedHeaders
		});
	}
	const qs = Object.keys(query)
		.sort()
		.map((k) => `${rfc3986(k)}=${rfc3986(query[k])}`)
		.join('&');

	const canonical = [
		method,
		path,
		qs,
		names.map((n) => `${n}:${headers[n]}\n`).join(''),
		signedHeaders,
		'UNSIGNED-PAYLOAD'
	].join('\n');
	const toSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonical)].join('\n');
	const signature = createHmac('sha256', signingKey(c.secret, date)).update(toSign).digest('hex');

	if (opts.presign) {
		return {
			url: `https://${host}${path}?${qs}&X-Amz-Signature=${signature}`,
			headers: Object.fromEntries(names.filter((n) => n !== 'host').map((n) => [n, headers[n]]))
		};
	}
	const out = { ...headers };
	delete out.host;
	out.authorization = `AWS4-HMAC-SHA256 Credential=${c.key}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
	return { url: `https://${host}${path}${qs ? `?${qs}` : ''}`, headers: out };
}

/**
 * Presigned PUT for a direct browser upload. The returned headers are part of the signature:
 * the browser must send them unchanged (they are stored with the object).
 */
export function presignPut(key: string, headers: Record<string, string>, expires = 900) {
	return sign('PUT', key, { headers, presign: expires });
}

export async function putObject(
	key: string,
	body: Uint8Array<ArrayBuffer> | string,
	headers: Record<string, string>
) {
	const s = sign('PUT', key, { headers });
	const res = await fetch(s.url, { method: 'PUT', headers: s.headers, body });
	if (!res.ok) throw new Error(`R2 PUT ${res.status}`);
}

export async function getObject(key: string): Promise<Response | null> {
	const s = sign('GET', key);
	const res = await fetch(s.url, { headers: s.headers });
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`R2 GET ${res.status}`);
	return res;
}

export async function deleteObject(key: string) {
	const s = sign('DELETE', key);
	const res = await fetch(s.url, { method: 'DELETE', headers: s.headers });
	if (!res.ok && res.status !== 404) throw new Error(`R2 DELETE ${res.status}`);
}

/** Map a public media URL back to its bucket key (only for our own domain). */
export function keyFromUrl(url: string): string | null {
	const base = `${need().media}/`;
	if (!url.startsWith(base)) return null;
	return decodeURIComponent(url.slice(base.length).split('?')[0]);
}
