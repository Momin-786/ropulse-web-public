FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG SITE_URL=http://localhost:3000
ARG SITE_INDEXABLE=false
ARG COMPANY_NAME
ARG SUPPORT_EMAIL
ARG SALES_EMAIL
ARG IDENTITY_URL
ARG DOCS_PUBLIC_DRAFTS=true
ENV SITE_URL=$SITE_URL SITE_INDEXABLE=$SITE_INDEXABLE COMPANY_NAME=$COMPANY_NAME SUPPORT_EMAIL=$SUPPORT_EMAIL SALES_EMAIL=$SALES_EMAIL IDENTITY_URL=$IDENTITY_URL DOCS_REVIEW_MODE=false DOCS_PUBLIC_DRAFTS=$DOCS_PUBLIC_DRAFTS
RUN npm run build:release

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ARG DOCS_PUBLIC_DRAFTS=true
ENV DOCS_PUBLIC_DRAFTS=$DOCS_PUBLIC_DRAFTS
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000 NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
