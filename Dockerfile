FROM node:13-alpine

WORKDIR /usr/src/app

RUN apk update && apk add bash

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm" , "start"]