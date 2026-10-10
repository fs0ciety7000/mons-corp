uniform vec3 uColor;
uniform float uTime;
uniform float uFacet;
uniform float uReveal;
uniform float uEnergy;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;
varying float vPulse;

void main() {
	vec3 N = normalize(vNormal);
	vec3 flatN = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
	N = normalize(mix(N, flatN, uFacet));
	vec3 V = normalize(-vViewPos);

	float ndv = max(dot(N, V), 0.0);
	float fresnel = pow(1.0 - ndv, 2.6);

	// Iridescence bounded around the active signal colour (IQ cosine palette).
	vec3 irid = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + dot(N, vec3(0.35, 0.6, 0.2)) * 0.5 + uTime * 0.04));
	vec3 tint = mix(uColor, irid * uColor * 1.6, 0.3);

	vec3 key = normalize(vec3(-0.55, 0.75, 0.6));
	vec3 back = normalize(vec3(0.6, -0.3, -0.8));
	float diff = max(dot(N, key), 0.0);
	float rim = pow(max(dot(N, back) * -1.0 + 0.2, 0.0), 2.0);
	float spec = pow(max(dot(reflect(-key, N), V), 0.0), mix(28.0, 90.0, uFacet));

	// Eclipse: dark core, light only grazes the silhouette.
	vec3 c = vec3(0.016, 0.016, 0.022);
	c += tint * diff * 0.16;
	c += tint * fresnel * (1.25 + uEnergy * 0.8);
	c += mix(vec3(1.0), tint, 0.55) * spec * 0.55;
	c += tint * rim * 0.35;
	c += tint * smoothstep(0.05, 0.35, vDisp) * 0.22;

	c *= smoothstep(0.0, 0.6, uReveal);
	gl_FragColor = vec4(c, 1.0);
}
