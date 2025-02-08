# Use lightweight Node.js 18 base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better build caching
COPY package.json package-lock.json ./

# Install dependencies (excluding dev dependencies)
RUN npm install --omit=dev

# Copy remaining application files
COPY . .

# Expose the application port
EXPOSE 3000

# Set environment variables (optional, can be overridden at runtime)
ENV NODE_ENV=production

# Start the server
CMD ["npm", "run", "start"]
