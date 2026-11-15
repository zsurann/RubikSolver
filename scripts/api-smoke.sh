#!/usr/bin/env bash
# Prova veloce dell'API su `npm run dev:worker` (porta 8787): registrazione, progressi, export, cancellazione.
set -euo pipefail
B=${1:-http://localhost:8787}; J=$(mktemp); H=(-H 'Content-Type: application/json' -H "Origin: $B")
E="prova$RANDOM@example.com"
curl -sf -c "$J" "${H[@]}" "$B/api/auth/sign-up/email" -d "{\"email\":\"$E\",\"password\":\"password123\",\"name\":\"Prova\"}" >/dev/null
curl -sf -b "$J" "${H[@]}" -X PUT "$B/api/progress" -d '{"lessons":["notation"],"times":[],"scans":[],"updatedAt":"2026-01-01T00:00:00.000Z"}' >/dev/null
curl -sf -b "$J" "$B/api/progress" | grep -q notation
curl -sf -b "$J" "$B/api/export" | grep -q "$E"
curl -sf -b "$J" "${H[@]}" -X DELETE "$B/api/account" >/dev/null
test "$(curl -s -o /dev/null -w '%{http_code}' -b "$J" "$B/api/progress")" = 401
echo "API ok"
