# Three stages: install, build, then a runtime holding only Next's standalone server.
FROM node:24-alpine AS deps
WORKDIR /app
# Copied alone so the install layer is cached until the lockfile itself changes.
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
# Rewrites are compiled into the build, so the backend address must be known now, not at run time.
ARG API_PROXY_TARGET
# next.config refuses to build without a key; the real one is only ever given at run time, never baked in.
ENV API_PROXY_TARGET=${API_PROXY_TARGET} \
    FRONTEND_API_KEY=build-time-placeholder \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN test -n "$API_PROXY_TARGET" || (echo "pass --build-arg API_PROXY_TARGET=http://<backend>:8000" >&2 && exit 1)
RUN npm run build

FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Owns nothing it runs, so a flaw in the app cannot rewrite the app; only Next's cache is writable.
RUN addgroup -S -g 10001 app && adduser -S -u 10001 -G app app
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
RUN mkdir -p .next/cache && chown app:app .next/cache
USER app

EXPOSE 3000

# robots.txt is tiny and touches no backend, so a slow API never marks the site unhealthy.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
