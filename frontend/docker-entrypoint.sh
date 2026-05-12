#!/bin/sh
set -eu

: "${NGINX_PORT:=80}"
: "${API_UPSTREAM:?API_UPSTREAM is required, for example http://school-trainer-backend.localhost.sslip.io}"

export NGINX_PORT API_UPSTREAM

envsubst '${NGINX_PORT} ${API_UPSTREAM}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
