FROM node:16 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-slim

WORKDIR /app

USER node

COPY --from=build /app/dist /app/dist

RUN npm install -g serve

CMD ["sh", "-c", "serve -s dist]
