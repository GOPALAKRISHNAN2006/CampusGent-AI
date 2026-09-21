# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package.json package-lock.json tsconfig.json ./

# Copy package structures for caching
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm ci

# Copy source codes
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

# Build workspaces
RUN npm run build:shared
RUN npm run build:web

# Production Stage - Nginx
FROM nginx:alpine

# Copy built static files
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Custom nginx server block to support SPA React Router redirects
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
