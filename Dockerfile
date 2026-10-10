# syntax=docker/dockerfile:1.7
# CARDOR Media — production image for Coolify (ADR-006)

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
# ADR-008: the same image recipe builds the four sites.
ARG PUBLIC_SITE=holding
ARG PUBLIC_DEPLOY_ENV=production
ENV PUBLIC_SITE=$PUBLIC_SITE PUBLIC_DEPLOY_ENV=$PUBLIC_DEPLOY_ENV
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
	PORT=3000 \
	HOST=0.0.0.0
COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
	CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "build"]
