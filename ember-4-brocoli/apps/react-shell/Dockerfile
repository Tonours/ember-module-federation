# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root files
COPY package*.json ./
COPY tsconfig*.json ./

# Copy packages
COPY packages ./packages

# Copy react-shell
COPY apps/react-shell ./apps/react-shell

# Install dependencies
RUN npm install

# Build packages first
RUN npm run build --workspace=@packages/ui
RUN npm run build --workspace=@packages/data

# Build react-shell
# URLs are determined at runtime via window.location.origin and relative paths
# Build args can be provided for dev overrides if needed
ARG EMBER_APP_URL
ARG ALLOWED_IFRAME_ORIGIN
ARG API_URL

ENV NODE_ENV=production

WORKDIR /app/apps/react-shell
RUN npx webpack --mode production

# Production stage
FROM nginx:alpine

# Copy nginx config
COPY apps/react-shell/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=builder /app/apps/react-shell/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
