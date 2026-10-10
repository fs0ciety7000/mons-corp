import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { easeCurves } from './tokens.ts';

let registered = false;

/** Single registration point for GSAP plugins and the CARDOR easing curves. */
function register() {
	if (registered || typeof window === 'undefined') return;
	gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
	for (const [name, path] of Object.entries(easeCurves)) CustomEase.create(name, path);
	gsap.defaults({ ease: 'cardor.out', duration: 0.8 });
	// Shared timelines target elements that only exist on some sites (ADR-008).
	gsap.config({ nullTargetWarn: false });
	gsap.ticker.lagSmoothing(0);
	registered = true;
}

register();

export { gsap, ScrollTrigger, SplitText, CustomEase };
