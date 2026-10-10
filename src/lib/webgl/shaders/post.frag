// Single post pass: radial chromatic aberration + halo + vignette + film grain (motion report §4.4).
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uTime;
uniform float uAberration;
uniform float uGlow;
uniform vec2 uCenter;
uniform float uScrimTop;

varying vec2 vUv;

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

void main() {
	vec2 uv = vUv;
	vec2 dir = uv - 0.5;
	float d = length(dir * vec2(uResolution.x / uResolution.y, 1.0));

	float ab = uAberration * (0.15 + d);
	vec3 col;
	col.r = texture2D(tScene, uv - dir * ab).r;
	col.g = texture2D(tScene, uv).g;
	col.b = texture2D(tScene, uv + dir * ab).b;

	// Soft halo behind the Core.
	vec2 hc = (uv - uCenter) * vec2(uResolution.x / uResolution.y, 1.0);
	col += uColor * exp(-length(hc) * 3.2) * 0.1 * uGlow;

	// Scrim under the text zone (bottom of the hero): the Core dims to 30 % there.
	col *= mix(0.3, 1.0, smoothstep(uScrimTop - 0.15, uScrimTop, uv.y));

	// Vignette towards the Void background.
	vec3 voidColor = vec3(0.027, 0.027, 0.039);
	col = mix(voidColor * 0.6, col, 1.0 - smoothstep(0.2, 1.25, d));

	// Film grain at 24 fps.
	float g = hash(uv * uResolution + floor(uTime * 24.0)) - 0.5;
	col += g * 0.045;
	gl_FragColor = vec4(col, 1.0);
}
