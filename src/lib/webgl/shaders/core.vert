// The Core — displaced sphere (motion report §4).
uniform float uTime;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uFacet;
uniform float uPulse;
uniform float uFlow;
uniform float uReveal;
uniform float uEnergy;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;
varying float vPulse;

float displacement(vec3 p) {
	float t = uTime * 0.18;
	vec3 q = p * uNoiseFreq;

	// Domain warping: stronger with uFlow (Creative Lab = ink / fluid).
	vec3 warp = vec3(
		snoise(q + vec3(0.0, 1.7, t)),
		snoise(q + vec3(5.2, t, 2.8)),
		snoise(q + vec3(t, 7.3, 3.1))
	);
	float n = snoise(q + warp * (0.35 + uFlow * 1.6) + vec3(t * 0.7));

	// Radial sound waves (Soundworks).
	float lat = dot(p, normalize(vec3(0.25, 1.0, 0.15)));
	float wave = sin(lat * 16.0 - uTime * 3.2) * (0.55 + 0.45 * snoise(p * 2.0 + t));
	float pulse = uPulse * wave * 0.07;

	float d = n * uNoiseAmp * (1.0 + uEnergy) + pulse;

	// Terracing (Interactive): quantised displacement → crystalline steps.
	float stepped = floor(d * 10.0 + 0.5) / 10.0;
	return mix(d, stepped, uFacet * 0.85);
}

void main() {
	vec3 p = normalize(position);

	// Finite-difference normal of the displaced surface.
	vec3 tangent = normalize(cross(p, abs(p.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
	vec3 bitangent = normalize(cross(p, tangent));
	float eps = 0.012;

	float d0 = displacement(p);
	vec3 pA = normalize(p + tangent * eps);
	vec3 pB = normalize(p + bitangent * eps);
	vec3 P0 = p * (1.0 + d0);
	vec3 PA = pA * (1.0 + displacement(pA));
	vec3 PB = pB * (1.0 + displacement(pB));
	vec3 n = normalize(cross(PA - P0, PB - P0));
	if (dot(n, p) < 0.0) n = -n;

	float reveal = smoothstep(0.0, 1.0, uReveal);
	vec3 displaced = p * (0.6 + 0.4 * reveal) * (1.0 + d0 * reveal);

	vDisp = d0;
	vPulse = uPulse;
	vNormal = normalize(normalMatrix * n);
	vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
	vViewPos = mv.xyz;
	gl_Position = projectionMatrix * mv;
}
