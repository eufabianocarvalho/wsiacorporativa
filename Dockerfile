FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
<<<<<<< HEAD
COPY bun.lockb* ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps
=======

# Copy bun.lockb if exists
COPY bun.lockb* ./

# Install dependencies
RUN npm install
>>>>>>> f7d7cd7a330e3225199c2c994fb162cd7d78a939

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 80

# Start the application
<<<<<<< HEAD
CMD ["serve", "-s", "dist", "-l", "80"]
=======
CMD ["serve", "-s", "dist", "-l", "80"]
>>>>>>> f7d7cd7a330e3225199c2c994fb162cd7d78a939
