# Multi-arch: let the base image follow the build's target platform (amd64 or
# arm64) so the same tag runs on both x86 and Graviton nodes. Do NOT pin
# --platform here — that bakes amd64 binaries into the arm64 manifest entry.
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Expose the port the app runs on
EXPOSE 3009

# Set environment variable for port
ENV PORT=3009

# Start the application
# Using node directly since app.js already creates and listens on the server
CMD ["node", "app.js"]

