# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat

# ---- Dependencies (Production) ----
FROM base AS deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# ---- Build ----
FROM base AS build
# Install ALL dependencies including dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

# ---- Production ----
FROM base as production
ENV NODE_ENV=production
COPY --from=build /usr/src/app/dist ./dist
# Copy ONLY production dependencies from the 'deps' stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json .

# Copy data to the correct location relative to the 'dist' folder
COPY --from=build /usr/src/app/src/data ./dist/data

EXPOSE 3001
CMD ["node", "dist/index.js"]
