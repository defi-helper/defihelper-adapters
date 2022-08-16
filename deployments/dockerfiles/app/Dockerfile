FROM node:16-alpine AS build

WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}
ARG DFH_HOST
ARG CACHE_HOST
ARG CACHE_AUTH

RUN apk --update add python3 build-base
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run adapters-ts:build
RUN npm run client:build

FROM node:16-alpine
WORKDIR /app
COPY . .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public/dist ./public/dist
COPY --from=build /app/adapters-public-ts ./adapters-public-ts
EXPOSE 8080
CMD [ "/bin/sh","-c","ln -s ./configuration/.env ./.env && node ./server/index.js"]
