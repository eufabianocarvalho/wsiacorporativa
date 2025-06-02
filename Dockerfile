FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./


# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 80

# Start the application

