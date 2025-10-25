FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production

RUN addgroup -g 1001 -S nodejs && adduser -S mcpserver -u 1001 && chown -R mcpserver:nodejs /app
USER mcpserver

ENV YOUTUBE_API_KEY=""

CMD ["npm", "start"]