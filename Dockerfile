# multi stage dockerfile build, first stage is to build the app and second stage is to run the app in nginx server

FROM node:18 as build-stage

WORKDIR /app

COPY package*.json ./
COPY vendor ./vendor
RUN npm install

COPY . .
ARG FRONTEND_CHANNEL=latest
RUN VITE_FRONTEND_CHANNEL="$FRONTEND_CHANNEL" npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
