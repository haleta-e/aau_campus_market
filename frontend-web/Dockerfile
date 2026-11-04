# ============================================================
#  AAU Campus Market – Web Frontend Docker Image
#  Multi-stage build:
#    Stage 1 "builder" — Node 20, installs deps, runs Vite build
#    Stage 2 "runner"  — Nginx Alpine, copies /dist, serves app
# ============================================================

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first (layer-cache optimisation)
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDeps needed for the build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# VITE_API_BASE_URL is injected at build time.
# Pass it via --build-arg when building locally, or as an env-var in Render.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Run TypeScript check + Vite production build → outputs to /app/dist
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Nginx runs in the foreground so Docker can track the process
CMD ["nginx", "-g", "daemon off;"]
