# Stage 1: Build the Svelte application with Bun
FROM docker.io/oven/bun:latest AS builder
# Set the working directory in the container
WORKDIR /app

# Copy package.json and bun.lockb (if you have one)
# This leverages Podman's cache for faster builds if dependencies don't change.
COPY package.json bun.lock ./

# Install project dependencies using Bun
RUN bun install 

# Copy the rest of your application code
COPY . .

# Build the Svelte application for production using Bun
# 假设你的构建命令是 'bun run build'，并且输出在 'build' 或 'dist' 目录
# 如果你的构建脚本或输出目录不同，请相应调整
RUN bun run build

# Stage 2: Serve the built application with a lightweight web server
FROM docker.io/nginx:alpine

# Copy the built application from the 'builder' stage into the Nginx html directory
# 根据你的实际构建输出目录调整，例如 '/app/dist'
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80, which is the default port for Nginx
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]