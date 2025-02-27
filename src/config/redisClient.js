import createClient from 'redis';

const redisClient = createClient.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6380',
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6380,
    password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('connect', () => console.log('Redis connected'));

async function connectRedis () {
    await redisClient.connect();
}

async function getCache(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
}

async function setCache(key, value, ttl = 3000) {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
}

async function invalidateCache(key) {
    const keys = await redisClient.keys(`${prefix}:*`);

    if (keys.length > 0) {
        await redisClient.del(keys);
    }
}

export { connectRedis, getCache, setCache, invalidateCache };
export default redisClient;