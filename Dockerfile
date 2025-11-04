# ==========================================
# Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy tsconfig and source code
COPY tsconfig.json ./
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.ts ./

# Build TypeScript to JavaScript (includes seeds)
RUN pnpm build

# ==========================================
# Production Stage
# ==========================================
FROM node:20-alpine AS production

# Install pnpm in production stage
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S starwars -u 1001

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ONLY production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder
COPY --from=builder --chown=starwars:nodejs /app/dist ./dist
COPY --from=builder --chown=starwars:nodejs /app/drizzle ./drizzle
COPY --chown=starwars:nodejs drizzle.config.ts ./

# Copy startup script
COPY --chown=starwars:nodejs start.sh ./
RUN chmod +x start.sh

# Change to non-root user
USER starwars

# Expose port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/films', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start application with migrations
CMD ["./start.sh"]
