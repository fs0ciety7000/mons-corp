/** Live reachability of the launcher's projects, read from /api/status (ADR-012). */
export interface Probe {
	up: boolean;
	ms: number;
}

export const status = $state<{
	results: Record<string, Probe>;
	at: number | null;
	failed: boolean;
}>({
	results: {},
	at: null,
	failed: false
});

async function load() {
	try {
		const res = await fetch('/api/status', { headers: { accept: 'application/json' } });
		if (!res.ok) throw new Error(String(res.status));
		const data = (await res.json()) as { at: number; results: Record<string, Probe> };
		status.results = data.results;
		status.at = data.at;
		status.failed = false;
	} catch {
		status.failed = true;
	}
}

/** Poll once a minute while the tab is visible. Returns a cleanup function. */
export function watchStatus() {
	let timer: ReturnType<typeof setInterval> | undefined;
	const start = () => {
		if (timer) return;
		load();
		timer = setInterval(load, 60_000);
	};
	const stop = () => {
		clearInterval(timer);
		timer = undefined;
	};
	const sync = () => (document.hidden ? stop() : start());
	document.addEventListener('visibilitychange', sync);
	sync();
	return () => {
		stop();
		document.removeEventListener('visibilitychange', sync);
	};
}
