#!/bin/sh
set -eu

: "${NGINX_PORT:=80}"
: "${API_UPSTREAM:?API_UPSTREAM is required, for example http://coolify:80}"
: "${API_UPSTREAM_HOST:?API_UPSTREAM_HOST is required, for example school-trainer-backend.sslip.io}"

export NGINX_PORT API_UPSTREAM API_UPSTREAM_HOST

envsubst '${NGINX_PORT} ${API_UPSTREAM} ${API_UPSTREAM_HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
