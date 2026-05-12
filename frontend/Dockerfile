FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json

RUN npm ci --workspace=@school-trainer/frontend --include-workspace-root=false

COPY frontend ./frontend

RUN npm run build -w frontend

FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENV NGINX_PORT=80
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
