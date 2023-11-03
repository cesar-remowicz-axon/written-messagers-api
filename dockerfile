FROM node:18.17.1-alpine as build

ARG PORT

ENV PORT ${PORT}

WORKDIR /server

COPY . .
COPY package.json ./
COPY tsconfig.json ./
COPY ecosystem.config.js ./

RUN npm install

RUN npm run tsc

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
