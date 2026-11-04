# ===================================================
# Stage 1: Build React production bundle
# ===================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests first for efficient caching
COPY package*.json ./

# Install all dependencies (including devDependencies required for vite build)
RUN npm ci || npm install

# Copy application source code
COPY . .

# Build production assets inside dist directory
RUN npm run build

# ===================================================
# Stage 2: Serve with lightweight Nginx Alpine
# ===================================================
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (reverse proxy + SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
