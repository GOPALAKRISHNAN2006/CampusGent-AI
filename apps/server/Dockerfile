# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package.json package-lock.json tsconfig.json ./

# Copy package structures for caching
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN npm ci

# Copy source codes
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Build workspaces
RUN npm run build:shared
RUN npm run build:server

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy built outputs and root package to resolve workspaces
COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/apps/server/.env ./apps/server/

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "apps/server/dist/server.js"]
