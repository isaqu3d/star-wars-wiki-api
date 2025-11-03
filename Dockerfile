# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Enable Corepack so pnpm is available
RUN corepack enable

# Copy only the files required to install dependencies
# 🔄 Changed: use pnpm-lock.yaml instead of package-lock.json
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm instead of npm
# 🔄 Changed: replaced "npm ci" with "pnpm install --frozen-lockfile"
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
# 🔄 Changed: replaced "npm run build" with "pnpm run build"
RUN pnpm run build


# ---- Production stage ----
FROM node:20-alpine AS production

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S starwars -u 1001

WORKDIR /app

# Enable Corepack again to use pnpm in this stage
RUN corepack enable

# Copy package files again for production dependencies
# 🔄 Changed: include pnpm-lock.yaml for pnpm to use the correct lockfile
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
# 🔄 Changed: replaced "npm ci --only=production" with pnpm equivalent
RUN pnpm install --frozen-lockfile --prod

# Copy built files and other required assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Copy configuration file
COPY drizzle.config.ts ./

# Set correct file ownership
RUN chown -R starwars:nodejs /app

# Run as non-root user
USER starwars

# Expose the application port
EXPOSE 3333

# Healthcheck to verify if the service is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/server.js"]
