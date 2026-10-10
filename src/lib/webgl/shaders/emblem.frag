uniform vec3 uColor;
uniform float uTime;
uniform float uFacet;
uniform float uPulse;
uniform float uReveal;
uniform float uEnergy;
uniform float uTone;
uniform float uFade;

varying vec3 vViewPos;
varying vec3 vLocal;

float luma(vec3 c) {
	return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
	// Flat shading from screen-space derivatives: crisp facets on the extruded faces.
	vec3 N = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
	vec3 V = normalize(-vViewPos);
	if (dot(N, V) < 0.0) N = -N;

	float ndv = max(dot(N, V), 0.0);
	float fresnel = pow(1.0 - ndv, 3.5);

	// Same iridescence as the sphere, bounded around the signal colour, and capped in luminance so
	// a bright signal (Acid lime) never outshines the text (design review, brightness budget).
	vec3 irid = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + dot(N, vec3(0.35, 0.6, 0.2)) * 0.5 + uTime * 0.04));
	vec3 tint = mix(uColor, irid * uColor * 1.6, 0.16);
	tint *= min(1.0, 0.45 / max(luma(uColor), 0.001)) * uTone;

	// Soundworks: ±6 % luminance waves climbing the belfry.
	tint *= 1.0 + 0.06 * sin(vLocal.y * 5.0 - uTime * 2.618) * uPulse;

	vec3 key = normalize(vec3(-0.55, 0.75, 0.6));
	vec3 back = normalize(vec3(0.6, -0.3, -0.8));
	float diff = max(dot(N, key), 0.0);
	float rim = pow(max(-dot(N, back) + 0.2, 0.0), 2.0);
	float spec = pow(max(dot(reflect(-key, N), V), 0.0), mix(28.0, 90.0, uFacet));

	// A slow sheen sweeps the front faces so the flat emblem catches the light like the old sphere.
	float sweep = mod(uTime * 0.35, 6.0) - 3.0;
	float sheen = pow(max(0.0, 1.0 - abs(dot(vLocal.xy, vec2(0.86, 0.5)) - sweep) * 1.6), 3.0);

	// Eclipse: faces mostly dark, light grazes the bevels and the silhouette.
	vec3 c = vec3(0.016, 0.016, 0.022);
	c += tint * diff * 0.16;
	c += tint * sheen * ndv * 0.45;
	c += tint * fresnel * (2.0 + uEnergy * 0.8);
	c += mix(vec3(1.0), tint, 0.55) * spec * 0.3;
	c += tint * rim * 0.3;

	c *= smoothstep(0.0, 0.6, uReveal) * uFade;
	float l = luma(c);
	if (l > 0.55) c *= 0.55 / l;
	gl_FragColor = vec4(c, 1.0);
}
