# Production Dockerfile for GCP Cloud Run deployment
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Install dependencies (utilizing Docker layer caching)
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy source code
COPY . .

# Set non-root user for security
USER node

# Expose target port (matches Cloud Run container contract)
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
