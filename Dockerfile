FROM node:18-alpine

WORKDIR /app

# Copy backend package.json first
COPY backend/package.json ./
COPY backend/package-lock.json* ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend application code
COPY backend/ ./

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["npm", "start"]
