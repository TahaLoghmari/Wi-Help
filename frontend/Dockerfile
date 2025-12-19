# ============================================
# Multi-stage Production Build
# ============================================

# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Set build arguments for environment variables
ARG VITE_API_URL
# ARG VITE_APP_URL
# ARG VITE_ENVIRONMENT
ARG NODE_ENV

# Copy package files
COPY package*.json ./

# Install dependencies with clean install for reproducible builds
# Use --frozen-lockfile if using package-lock.json
# Install ALL dependencies (including devDependencies) needed for build
RUN npm ci --include=dev

# Set environment variables for Vite build (after dependencies are installed)
ENV VITE_API_URL=$VITE_API_URL
# ENV VITE_APP_URL=$VITE_APP_URL
# ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT
ENV NODE_ENV=$NODE_ENV

# Copy source code
COPY . .

# Build the optimized production bundle
# This will use the optimized vite.config.ts with:
# - Terser minification
# - Tree shaking
# - Code splitting
# - Console.log removal
RUN npm run build

# Stage 2: Production nginx server
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy optimized nginx configuration for port 5173
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure nginx runtime directories exist and are owned by the nginx user.
# Do this at build time (runs as root) so the running container doesn't need to
# perform chown/mkdir operations that can fail if the entrypoint runs as a
# non-root user or if the filesystem prevents chown at runtime.
RUN mkdir -p /var/cache/nginx /var/run/nginx /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx /var/run/nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 5173 (matching Vite dev server port)
EXPOSE 5173

# # Health check - verify nginx is responding
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
#   CMD curl -f http://localhost:5173/health || exit 1

# Start nginx in foreground (use the base image behavior; master runs as root and
# worker processes drop to the `nginx` user as configured in nginx.conf)
CMD ["nginx", "-g", "daemon off;"]