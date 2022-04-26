FROM node:16-alpine AS build

WORKDIR /app

ARG CACHE_AUTH

ARG CACHE_HOST
ENV CACHE_HOST ${CACHE_HOST:-https://adapters.defihelper.io/cache}

RUN apk --update add python3 build-base
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run adapters:build
RUN npm run adapters-ts:build
RUN npm run client:build

FROM node:16-alpine
WORKDIR /app
COPY . .
COPY --from=build /app/adapters-public ./adapters-public
COPY --from=build /app/adapters-public-ts ./adapters-public-ts
EXPOSE 8080
CMD [ "node", "./server/index.js" ]
