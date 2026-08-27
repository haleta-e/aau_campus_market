# ─── Stage 1: Build Stage ──────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app/backend

# Install dependencies first for layer caching
COPY backend/package*.json ./
RUN npm ci

# Copy TypeScript code and assets
COPY backend/tsconfig.json backend/drizzle.config.ts ./
COPY backend/src/ ./src/
COPY backend/drizzle/ ./drizzle/
COPY backend/public/ ./public/

# Build TypeScript
RUN npm run build

# ─── Stage 2: Production Runtime ──────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies only
COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy build artifacts and assets
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/drizzle ./drizzle
COPY --from=builder /app/backend/public ./public
COPY --from=builder /app/backend/drizzle.config.ts ./
COPY --from=builder /app/backend/package.json ./

EXPOSE 4000

CMD ["node", "dist/server.js"]
