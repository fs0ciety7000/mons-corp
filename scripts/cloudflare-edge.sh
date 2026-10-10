#!/usr/bin/env bash
# Cloudflare edge configuration for cardormedia.com (idempotent).
#  - SSL Full (strict), TLS ≥ 1.2, records proxied (orange cloud)
#  - "Always Use HTTPS" stays OFF on purpose: Traefik (Coolify) already redirects HTTP → HTTPS
#    while serving ACME HTTP-01 challenges, which keeps origin certificate renewals working.
#  - Alias subdomains play./audio./art. and www. → 301 at the edge (path + query kept,
#    ACME challenge path excluded).
# Requires CLOUDFLARE_API_TOKEN (Zone: DNS edit, Zone settings edit, Dynamic redirect edit).
set -euo pipefail
ZONE_NAME=${ZONE_NAME:-cardormedia.com}
SERVER_IP=${COOLIFY_SERVER_IP:-152.53.176.13}
API=https://api.cloudflare.com/client/v4
: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is required}"
H=(-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json")
Z=$(curl -fsS "${H[@]}" "$API/zones?name=$ZONE_NAME" | python3 -c 'import json,sys;print(json.load(sys.stdin)["result"][0]["id"])')

setting() { curl -fsS "${H[@]}" -X PATCH "$API/zones/$Z/settings/$1" -d "{\"value\":\"$2\"}" >/dev/null && echo "setting $1=$2"; }
setting ssl strict
setting min_tls_version 1.2
setting always_use_https off

# Proxied A records (main sites + aliases; the aliases never reach the origin).
for n in @ www interactive sound creative play audio art; do
	fqdn=$ZONE_NAME; [ "$n" != "@" ] && fqdn="$n.$ZONE_NAME"
	id=$(curl -fsS "${H[@]}" "$API/zones/$Z/dns_records?type=A&name=$fqdn" | python3 -c 'import json,sys;r=json.load(sys.stdin)["result"];print(r[0]["id"] if r else "")')
	body="{\"type\":\"A\",\"name\":\"$fqdn\",\"content\":\"$SERVER_IP\",\"ttl\":1,\"proxied\":true}"
	if [ -n "$id" ]; then curl -fsS "${H[@]}" -X PUT "$API/zones/$Z/dns_records/$id" -d "$body" >/dev/null; else curl -fsS "${H[@]}" -X POST "$API/zones/$Z/dns_records" -d "$body" >/dev/null; fi
	echo "A $fqdn proxied"
done

# Edge redirects (single ruleset in the dynamic redirect phase; PUT replaces it as a whole).
python3 - "$ZONE_NAME" > /tmp/cardor-redirects.json <<'PY'
import json, sys
zone = sys.argv[1]
pairs = [("www", ""), ("play", "interactive."), ("audio", "sound."), ("art", "creative.")]
rules = []
for src, dst in pairs:
    rules.append({
        "description": f"{src}.{zone} → {dst}{zone}",
        "expression": f'(http.host eq "{src}.{zone}" and not starts_with(http.request.uri.path, "/.well-known/acme-challenge/"))',
        "action": "redirect",
        "action_parameters": {"from_value": {
            "status_code": 301,
            "target_url": {"expression": f'concat("https://{dst}{zone}", http.request.uri.path)'},
            "preserve_query_string": True}},
        "enabled": True,
    })
print(json.dumps({"description": "CARDOR alias redirects", "rules": rules}))
PY
curl -fsS "${H[@]}" -X PUT "$API/zones/$Z/rulesets/phases/http_request_dynamic_redirect/entrypoint" \
	-d @/tmp/cardor-redirects.json | python3 -c 'import json,sys;r=json.load(sys.stdin)["result"];print("redirect rules:", [x["description"] for x in r["rules"]])'
