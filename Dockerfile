FROM node:alpine

WORKDIR /client

COPY package*.json ./

RUN npm install

RUN npm run build

COPY . .