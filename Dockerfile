# Stage 1: Build the app
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app source code
COPY . .

# Build the Next.js app
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
