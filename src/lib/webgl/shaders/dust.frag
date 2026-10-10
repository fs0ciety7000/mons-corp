uniform vec3 uColor;
varying float vAlpha;

void main() {
	vec2 uv = gl_PointCoord - 0.5;
	float d = length(uv);
	float a = 1.0 - smoothstep(0.0, 0.5, d);
	vec3 col = mix(vec3(0.93, 0.91, 0.87), uColor, 0.45);
	gl_FragColor = vec4(col * a * vAlpha, a * vAlpha);
}
