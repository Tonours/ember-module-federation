# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root files
COPY package*.json ./
COPY tsconfig*.json ./

# Copy packages
COPY packages ./packages

# Copy mf-profile
COPY apps/mf-profile ./apps/mf-profile

# Install dependencies
RUN npm install

# Build packages first
RUN npm run build --workspace=@packages/ui
RUN npm run build --workspace=@packages/data

# Build mf-profile
ENV NODE_ENV=production
WORKDIR /app/apps/mf-profile
RUN npx webpack --mode production

# Production stage
FROM nginx:alpine

# Copy nginx config
COPY apps/mf-profile/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=builder /app/apps/mf-profile/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
