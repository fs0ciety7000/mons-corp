#!/usr/bin/env bash
# Create / update the cardormedia.com DNS records pointing at the Coolify server.
# Idempotent. Requires CLOUDFLARE_API_TOKEN (Zone:DNS:Edit on cardormedia.com).
# Records are "DNS only" (grey cloud) so Coolify can issue Let's Encrypt certificates
# over HTTP-01; switch to proxied afterwards with PROXIED=true if wanted.
set -euo pipefail
ZONE_NAME=${ZONE_NAME:-cardormedia.com}
SERVER_IP=${COOLIFY_SERVER_IP:-152.53.176.13}
PROXIED=${PROXIED:-false}
API=https://api.cloudflare.com/client/v4
: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is required}"
H=(-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json")

ZONE_ID=${CLOUDFLARE_ZONE_ID:-$(curl -fsS "${H[@]}" "$API/zones?name=$ZONE_NAME" | python3 -c 'import json,sys;print(json.load(sys.stdin)["result"][0]["id"])')}
echo "zone $ZONE_NAME → $ZONE_ID"

upsert() { # type name content [extra-json]
	local type=$1 name=$2 content=$3 extra=${4:-}
	local fqdn=$name; [ "$name" = "@" ] && fqdn=$ZONE_NAME || fqdn="$name.$ZONE_NAME"
	local id
	id=$(curl -fsS "${H[@]}" "$API/zones/$ZONE_ID/dns_records?type=$type&name=$fqdn" | python3 -c 'import json,sys;r=json.load(sys.stdin)["result"];print(r[0]["id"] if r else "")')
	local body="{\"type\":\"$type\",\"name\":\"$fqdn\",\"content\":\"$content\",\"ttl\":1${extra}}"
	if [ -n "$id" ]; then
		curl -fsS "${H[@]}" -X PUT "$API/zones/$ZONE_ID/dns_records/$id" -d "$body" >/dev/null && echo "updated $type $fqdn"
	else
		curl -fsS "${H[@]}" -X POST "$API/zones/$ZONE_ID/dns_records" -d "$body" >/dev/null && echo "created $type $fqdn"
	fi
}

for n in @ www interactive sound creative apps; do
	upsert A "$n" "$SERVER_IP" ",\"proxied\":$PROXIED"
done
# Only Let's Encrypt may issue certificates for the zone.
curl -fsS "${H[@]}" "$API/zones/$ZONE_ID/dns_records?type=CAA&name=$ZONE_NAME" | python3 -c 'import json,sys;sys.exit(0 if json.load(sys.stdin)["result"] else 1)' \
	|| curl -fsS "${H[@]}" -X POST "$API/zones/$ZONE_ID/dns_records" \
		-d "{\"type\":\"CAA\",\"name\":\"$ZONE_NAME\",\"data\":{\"flags\":0,\"tag\":\"issue\",\"value\":\"letsencrypt.org\"},\"ttl\":1}" >/dev/null && echo "CAA ok"
