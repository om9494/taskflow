# ===================================================
# TaskFlow Backend Dockerfile (Node.js + Express)
# ===================================================

# Use lightweight Node.js LTS Alpine image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production || npm install --omit=dev

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend application
CMD ["npm", "start"]
