uniform float uTime;
uniform float uPixelRatio;
uniform float uScatter;
uniform float uReveal;

attribute float aSeed;
attribute float aSize;

varying float vAlpha;

void main() {
	vec3 p = position;
	float t = uTime * (0.03 + aSeed * 0.04);
	float c = cos(t), s = sin(t);
	p.xz = mat2(c, -s, s, c) * p.xz;
	p.y += sin(uTime * 0.3 + aSeed * 40.0) * 0.08;

	vec3 drift = vec3(
		snoise(p * 0.6 + vec3(uTime * 0.05)),
		snoise(p * 0.6 + vec3(13.0, uTime * 0.05, 0.0)),
		snoise(p * 0.6 + vec3(0.0, 7.0, uTime * 0.05))
	);
	p += drift * (0.12 + uScatter * 0.9);
	p *= mix(0.4, 1.0, smoothstep(0.0, 1.0, uReveal));

	vec4 mv = modelViewMatrix * vec4(p, 1.0);
	gl_Position = projectionMatrix * mv;
	gl_PointSize = aSize * uPixelRatio * (6.0 / -mv.z);

	float twinkle = 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 90.0);
	vAlpha = twinkle * (1.0 - smoothstep(2.0, 9.0, -mv.z)) * uReveal;
}
