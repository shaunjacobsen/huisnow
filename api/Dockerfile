FROM node:13
WORKDIR /api
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn
COPY . .
EXPOSE 4000
CMD yarn run start