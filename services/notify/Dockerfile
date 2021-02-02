FROM node:13
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json .
RUN yarn
COPY . .