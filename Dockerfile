# -----------------------------------------------------------------------------
# STAGE 1: BUILD
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Cấu hình biến môi trường build-time (Vite cần biến VITE_ ở bước build)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Copy package files trước để cache layer dependencies
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm devDependencies để build)
RUN npm ci

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build


# -----------------------------------------------------------------------------
# STAGE 2: PRODUCTION
# -----------------------------------------------------------------------------
FROM node:20-alpine

WORKDIR /app

# Cài đặt runtime dependencies (giữ curl cho healthcheck giống backend)
RUN apk add --no-cache curl

# Cài đặt 'serve' để phục vụ các file tĩnh cho Single Page Application
RUN npm install -g serve \
    && npm cache clean --force \
    && rm -rf /root/.npm

# Copy file build từ stage builder
COPY --from=builder /app/dist ./dist

# Biến môi trường
ENV NODE_ENV=production

# Portal chạy trên port 5173 (theo cấu hình Nginx của bạn)
EXPOSE 5173

# Chạy server để serve thư mục dist
# -s: Single Page Application mode
# -l: Listen on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
