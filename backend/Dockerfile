FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci --workspace=@school-trainer/backend --include-workspace-root=false

COPY backend ./backend
COPY frontend ./frontend

RUN npm run build -w backend \
    && npm prune --omit=dev --workspace=@school-trainer/backend

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_PATH=/data/school.db

EXPOSE 3001
VOLUME ["/data"]

CMD ["npm", "run", "start", "-w", "backend"]
