FROM node:13
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn
COPY . .
EXPOSE 4000