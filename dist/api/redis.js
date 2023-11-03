"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis = async () => {
    const redis = require('redis');
    const client = await redis.createClient({
        host: '127.0.0.1',
        port: 6379
    });
    await client.connect().catch((e) => console.log('error on connect', e));
    await client.on('connect', () => {
        console.log('REDIS READY');
    });
    await client.on('error', (e) => {
        console.log('REDIS ERROR', e);
    });
    client.set('somenthing to create', 1);
    console.log('cache', client);
    return client;
};
exports.redis = redis;
//# sourceMappingURL=redis.js.map