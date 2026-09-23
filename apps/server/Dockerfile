# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

RUN npm ci

COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

RUN npm run build:shared && npm run build:server

# Production Stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

RUN npm ci --omit=dev && addgroup -S app && adduser -S app -G app

COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/server ./apps/server
COPY --from=builder /app/node_modules ./node_modules

RUN chown -R app:app /app
USER app

EXPOSE 5000

CMD ["node", "apps/server/src/server.js"]
