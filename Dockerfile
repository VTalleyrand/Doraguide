FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_MAPKIT_TOKEN
ENV VITE_MAPKIT_TOKEN=$VITE_MAPKIT_TOKEN

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

COPY --from=build /app/dist/ /app/dist/
COPY server/ /app/server/

RUN apk add --no-cache sqlite

ENV NODE_ENV=production
ENV PORT=80
ENV VOTES_DB_PATH=/data/dora-votes.sqlite

VOLUME ["/data"]

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]
