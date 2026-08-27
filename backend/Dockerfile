# ─── Stage 1: Build Stage ──────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for maximum Docker cache reuse
COPY package*.json ./
RUN npm ci

# Copy source code and config
COPY tsconfig.json drizzle.config.ts ./
COPY src/ ./src/
COPY drizzle/ ./drizzle/
COPY public/ ./public/

# Compile TypeScript to dist
RUN npm run build

# ─── Stage 2: Production Runtime ──────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled files, drizzle migrations, public assets, and configs from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/public ./public
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/package.json ./

# Expose backend port
EXPOSE 4000

# Start server
CMD ["node", "dist/server.js"]
