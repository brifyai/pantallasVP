# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port (Vite preview uses 4173 by default, but we'll use 5174)
EXPOSE 5174

# Start the application with host binding
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5174"]
