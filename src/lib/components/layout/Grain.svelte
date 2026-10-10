<!-- Film grain overlay at 24 fps (design report §3.4). -->
<div
	class="grain pointer-events-none fixed inset-[-50%] z-[90] opacity-[0.07]"
	aria-hidden="true"
></div>

<style>
	.grain {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.4 -0.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		animation: grain 1s steps(24) infinite;
		mix-blend-mode: overlay;
	}
	@keyframes grain {
		0% {
			transform: translate(0, 0);
		}
		10% {
			transform: translate(-5%, -10%);
		}
		20% {
			transform: translate(-15%, 5%);
		}
		30% {
			transform: translate(7%, -25%);
		}
		40% {
			transform: translate(-5%, 25%);
		}
		50% {
			transform: translate(-15%, 10%);
		}
		60% {
			transform: translate(15%, 0%);
		}
		70% {
			transform: translate(0%, 15%);
		}
		80% {
			transform: translate(3%, 35%);
		}
		90% {
			transform: translate(-10%, 10%);
		}
		100% {
			transform: translate(0, 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.grain {
			animation: none;
		}
	}
</style>
