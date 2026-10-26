FROM node:22.23.4-alpine as base
WORKDIR /app

# Add docker env arguments here

COPY ./package-lock.json .
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./src .
RUN npm install
RUN npx tsc

ENV NODE_PORT=3000
CMD [ "node", "./dist/index.js" ]