# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy Ember app
COPY apps/ember ./apps/ember

# Install dependencies
RUN cd apps/ember && npm install

# Build for production
# API_URL is passed to Ember build, defaults to /api if not provided
ARG API_URL=/api

RUN cd apps/ember && API_URL=${API_URL} npm run build -- --environment=production

# Production stage
FROM nginx:alpine

# Copy nginx config
COPY apps/ember/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=builder /app/apps/ember/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
