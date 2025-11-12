# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root files
COPY package*.json ./
COPY tsconfig*.json ./

# Copy packages
COPY packages ./packages

# Copy mf-blog-article
COPY apps/mf-blog-article ./apps/mf-blog-article

# Install dependencies
RUN npm install

# Build packages first
RUN npm run build --workspace=@packages/ui
RUN npm run build --workspace=@packages/data

# Build mf-blog-article
# API_URL is determined at runtime via relative path fallback
# Build arg can be provided for dev override if needed
ARG API_URL

ENV NODE_ENV=production
WORKDIR /app/apps/mf-blog-article
RUN npx webpack --mode production

# Production stage
FROM nginx:alpine

# Copy nginx config
COPY apps/mf-blog-article/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=builder /app/apps/mf-blog-article/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
