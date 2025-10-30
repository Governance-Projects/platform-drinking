# 1) Base com PNPM
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# 2) Dependências
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Prevent Prisma postinstall before the schema exists
ENV PRISMA_SKIP_POSTINSTALL=1
RUN pnpm install --frozen-lockfile

# 3) Builder
FROM deps AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Generate Prisma Client now that the schema is available, then build
RUN pnpm exec prisma generate && pnpm run build

# 4) Runner (produção)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
# Use node_modules from builder so it includes generated Prisma Client
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm","start"]


