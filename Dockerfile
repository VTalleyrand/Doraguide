FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_MAPKIT_TOKEN
ENV VITE_MAPKIT_TOKEN=$VITE_MAPKIT_TOKEN

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY server/ /app/server/
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY scripts/start-production.sh /app/start-production.sh

RUN apk add --no-cache nginx sqlite && chmod +x /app/start-production.sh

ENV NODE_ENV=production
ENV PORT=3001
ENV VOTES_DB_PATH=/data/dora-votes.sqlite

VOLUME ["/data"]

EXPOSE 80

CMD ["/app/start-production.sh"]
