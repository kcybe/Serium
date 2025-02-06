# --- Stage 1: Build the app ---
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    # Copy package files and install all dependencies
    COPY package*.json ./
    RUN npm ci
    
    # Copy source code and build the app
    COPY . .
    RUN npm run build
    
    # --- Stage 2: Setup the production container ---
    FROM node:18-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Copy production files from the builder stage
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    
    # Expose the port that Next.js uses (default is 3000)
    EXPOSE 3000
    
    # Start the Next.js production server
    CMD ["npm", "start"]