FROM node:15.14-slim

WORKDIR /app

COPY app/package*.json ./
COPY app/yarn.lock ./

RUN yarn install && yarn cache clean

COPY app/src .
COPY app/public .
