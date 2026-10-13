/** Copy text to the clipboard; falls back to a hidden textarea where the async API is missing. */
export async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const previous = document.activeElement as HTMLElement | null;
		const area = document.createElement('textarea');
		area.value = text;
		area.setAttribute('readonly', '');
		area.style.position = 'fixed';
		area.style.opacity = '0';
		document.body.append(area);
		area.select();
		let ok: boolean;
		try {
			ok = document.execCommand('copy');
		} catch {
			ok = false;
		}
		area.remove();
		previous?.focus();
		return ok;
	}
}
