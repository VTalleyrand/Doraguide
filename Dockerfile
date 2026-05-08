FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_MAPKIT_TOKEN
ENV VITE_MAPKIT_TOKEN=$VITE_MAPKIT_TOKEN

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80
