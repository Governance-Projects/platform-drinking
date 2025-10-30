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
# Ensure Prisma schema is available so postinstall can run
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# 3) Builder
FROM deps AS builder
COPY . .
RUN cp .env .env.example
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# 4) Runner (produção)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
# Use node_modules from deps; Prisma Client was generated during deps install
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm","start"]


