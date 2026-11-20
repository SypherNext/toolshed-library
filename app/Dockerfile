# Toolshed in three stages: install, build, then a small image that only runs the app.

# 1. Install every dependency exactly as package-lock.json says.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Build the app. This stage also has drizzle-kit and tsx, so the one-off
#    "migrate" service in compose.yaml uses it to update the database.
FROM deps AS builder
COPY . .
RUN npm run build

# 3. The image that runs: Node.js, the standalone server and nothing else.
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
RUN mkdir uploads && chown node:node uploads
USER node
EXPOSE 3000
CMD ["node", "server.js"]
