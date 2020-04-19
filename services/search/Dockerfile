FROM node:13
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json /app
COPY ./yarn.lock /app
RUN yarn
COPY . /app
EXPOSE 4001