# Use Node.js LTS lightweight image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (for caching dependencies)
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy rest of the source code
COPY . .

# Expose port
EXPOSE 80

# Start the app
CMD ["npm", "start"]
