# Build stage
# Use Node 20.19+ for Vite 7 compatibility
FROM node:20.19-alpine AS builder

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json* ./

# Copy packages (shared dependencies)
COPY packages ./packages

# Copy Ember app
COPY apps/ember-app ./apps/ember-app

# Install all dependencies (workspace install)
RUN npm install

# Build for production
# VITE_API_URL is injected at build time, defaults to /api if not provided
ARG VITE_API_URL=/api

RUN cd apps/ember-app && VITE_API_URL=${VITE_API_URL} npm run build

# Production stage
FROM nginx:alpine

# Copy nginx config
COPY apps/ember-app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app (Vite outputs to dist)
COPY --from=builder /app/apps/ember-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
