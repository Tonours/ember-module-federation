# Build stage
FROM node:18-alpine AS builder

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy API files
COPY apps/api/package*.json ./
COPY apps/api/tsconfig.docker.json ./tsconfig.json
COPY apps/api/prisma ./prisma/
COPY apps/api/scripts ./scripts/
COPY apps/api/src ./src/

# Install ALL dependencies (including devDependencies for building)
RUN npm install

# Create stub type definition for broccoli-plugin (Ember package leaking into monorepo)
RUN mkdir -p node_modules/@types/broccoli-plugin && \
    echo 'declare module "broccoli-plugin" { const content: any; export = content; }' > node_modules/@types/broccoli-plugin/index.d.ts

# Set NODE_ENV for production build (AFTER npm install)
ENV NODE_ENV=production

# Setup database provider (postgresql for production) and generate Prisma client
RUN node scripts/setup-db.cjs && npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS runtime

# Install OpenSSL for Prisma, nginx, and wget for health check
RUN apk add --no-cache openssl nginx wget

WORKDIR /app

# Set NODE_ENV for production
ENV NODE_ENV=production

# Copy package files
COPY apps/api/package*.json ./
COPY apps/api/prisma ./prisma/
COPY apps/api/scripts ./scripts/

# Install production dependencies only
RUN npm install --omit=dev

# Install tsx for seed script
RUN npm install tsx

# Setup database provider and generate Prisma client in production
RUN node scripts/setup-db.cjs && npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy nginx config and start script
COPY apps/api/nginx.conf /etc/nginx/http.d/default.conf
COPY apps/api/start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose port
EXPOSE 3333

# Health check (via nginx)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333/health || exit 1

# Start services
CMD ["./start.sh"]
