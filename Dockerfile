# ==========================================
# MediCare Hospital System - Production Dockerfile
# Multi-stage optimized build for TanStack Start & Nitro
# ==========================================

# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Copy package manifests
COPY package.json package-lock.json ./

# Install full dependencies for building
RUN npm install

# Copy application source code and configurations
COPY tsconfig.json tsr.config.json vite.config.ts ./
COPY src/ ./src/
COPY styles.css* ./

# Build production standalone bundle (Nitro outputs to .output)
RUN npm run build

# ==========================================
# Stage 2: Production runner stage
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Install curl for container health check
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 medicare

# Copy standalone built output from builder stage
COPY --from=builder --chown=medicare:nodejs /app/.output ./.output

# Ensure proper permissions
USER medicare

# Expose HTTP port
EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the standalone Nitro server
CMD ["node", ".output/server/index.mjs"]
