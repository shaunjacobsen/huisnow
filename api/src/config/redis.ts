import * as redis from 'redis';
require('dotenv').config();

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
});

client.on('connect', () => {
  console.log('Redis connected');
});

client.on('error', e => {
  console.log('Redis error', e);
});

export default client;
