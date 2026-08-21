# Use lightweight Node 20 Alpine image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY backend/package*.json ./backend/

# Install production dependencies only
WORKDIR /app/backend
RUN npm ci --omit=dev

# Copy backend source code
COPY backend/ ./

# Expose server port
EXPOSE 4000

# Start Express server
CMD ["node", "src/server.js"]
