FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY bun.lockb* ./

RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]