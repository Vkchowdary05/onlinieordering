# ========================================================
# Online Shopping & Order Management System - Dockerfile
# Multi-stage production build: Node.js 22 + Nginx Alpine
# ========================================================

# Stage 1: Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm ci || npm install

# Copy application source code and configs
COPY tsconfig*.json vite.config.ts index.html ./
COPY src/ ./src/
COPY public/ ./public/

# Build static production bundle
RUN npm run build

# ========================================================
# Stage 2: Production Nginx Server
# ========================================================
FROM nginx:alpine AS runner

# Install curl for container health check
RUN apk add --no-cache curl

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built distribution from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set environment
ENV NODE_ENV=production
ENV PORT=80

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/healthz || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
