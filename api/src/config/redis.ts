import redis from 'redis';

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
});

client.on('connect', () => {
  console.log('Redis connected');
});
