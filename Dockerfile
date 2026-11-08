# multi stage dockerfile build, first stage is to build the app and second stage is to run the app in nginx server

FROM node:22-bookworm-slim AS build-stage

WORKDIR /app

COPY package*.json ./
COPY vendor ./vendor
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
