// The Core as an emblem — extruded brand SVG, alive in each state's own way (motion report §4.2).
uniform float uTime;
uniform float uFacet;
uniform float uPulse;
uniform float uFlow;
uniform float uReveal;
uniform float uEnergy;

varying vec3 vViewPos;
varying vec3 vLocal;

float hash1(float n) {
	return fract(sin(n) * 43758.5453);
}

void main() {
	vec3 p = position;
	float t = uTime;

	// Breathing surface, like the old sphere but kept small so the emblem stays readable.
	float amp = 0.012 + uFlow * 0.028 + uEnergy * 0.02;
	p += vec3(
		snoise(p * 1.4 + vec3(0.0, 0.0, t * 0.25)),
		snoise(p * 1.4 + vec3(4.1, 0.0, t * 0.25)),
		snoise(p * 1.4 + vec3(0.0, 7.7, t * 0.25))
	) * amp;

	// Soundworks: a slow wave climbs the belfry (2.4 s period).
	p.z += sin(p.y * 5.0 - t * 2.618) * 0.02 * uPulse;

	// Interactive: a 120 ms glitch burst every ~5 s, horizontal slices shift by ≤ 2 % of the size.
	float cycle = floor(t / 5.0);
	float local = t - cycle * 5.0 - hash1(cycle) * 1.2;
	float burst = step(0.0, local) * step(local, 0.12);
	float band = floor(p.y * 7.0);
	p.x += (hash1(band + floor(t * 25.0)) - 0.5) * 0.1 * burst * uFacet;

	float reveal = smoothstep(0.0, 1.0, uReveal);
	p *= 0.7 + 0.3 * reveal;

	vLocal = position;
	vec4 mv = modelViewMatrix * vec4(p, 1.0);
	vViewPos = mv.xyz;
	gl_Position = projectionMatrix * mv;
}
