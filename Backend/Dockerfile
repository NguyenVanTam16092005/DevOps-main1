# ===== STAGE 1: Build =====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies for testing)
RUN npm ci --ignore-scripts

# Copy explicit source files to avoid sensitive data (docker:S6470)
COPY src/ ./src/
COPY server.js ./

# Run tests (pass if no tests found)
RUN npm test -- --passWithNoTests

# ===== STAGE 2: Production =====
FROM node:20-alpine

WORKDIR /app

# Install dumb-init để xử lý signals đúng cách
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json ./

# Install chỉ production dependencies
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Copy built app từ stage 1
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./

# Tạo non-root user cho security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8070), (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)}).on('error', (e) => {throw e})"

EXPOSE 8070

# Use dumb-init để wrap Node process
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "server.js"]
