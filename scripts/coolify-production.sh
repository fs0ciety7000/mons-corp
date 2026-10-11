#!/usr/bin/env bash
# Switch the five Coolify apps to their production domains on cardormedia.com
# (staging domains are kept as aliases), set PUBLIC_DEPLOY_ENV=production and redeploy.
# Run AFTER scripts/cloudflare-dns.sh, once the records resolve.
set -euo pipefail
: "${COOLIFY_API_URL:?}" "${COOLIFY_API_TOKEN:?}"
U=${COOLIFY_API_URL%/}/api/v1
H=(-H "Authorization: Bearer $COOLIFY_API_TOKEN" -H "Content-Type: application/json" -H "Accept: application/json")

# uuid | production domains | staging domain
APPS=(
	"szxysnkgapr4g7bseqbrruka|https://cardormedia.com,https://www.cardormedia.com|https://cardor.fs0ciety.org"
	"luwdosthown6up9dyyokmkby|https://interactive.cardormedia.com|https://occ-interactive.fs0ciety.org"
	"myii0yozmypvugxatkzo4xs3|https://sound.cardormedia.com|https://occ-soundworks.fs0ciety.org"
	"ourwq427ufzwruc9tcq9ytzq|https://creative.cardormedia.com|https://occ-creative.fs0ciety.org"
	"im8yympvpq6xhmvrj6g5wy43|https://apps.cardormedia.com|https://cardor-apps.fs0ciety.org"
)

set_env() { # uuid key value
	curl -fsS "${H[@]}" -X PATCH "$U/applications/$1/envs" -d "{\"key\":\"$2\",\"value\":\"$3\",\"is_preview\":false}" >/dev/null
}

uuids=()
for row in "${APPS[@]}"; do
	IFS='|' read -r uuid prod staging <<<"$row"
	curl -fsS "${H[@]}" -X PATCH "$U/applications/$uuid" -d "{\"domains\":\"$prod,$staging\"}" >/dev/null
	set_env "$uuid" PUBLIC_DEPLOY_ENV production
	set_env "$uuid" ORIGIN "${prod%%,*}"
	echo "configured $uuid → $prod"
	uuids+=("$uuid")
done
IFS=, ; curl -fsS "${H[@]}" -X POST "$U/deploy" -d "{\"uuid\":\"${uuids[*]}\"}"
echo
