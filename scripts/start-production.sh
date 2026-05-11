#!/bin/sh
set -eu

node /app/server/index.mjs &
node_pid="$!"

trap 'kill "$node_pid" 2>/dev/null || true' INT TERM EXIT

nginx -g 'daemon off;'
