"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
async function redisJSONDemo() {
    try {
        const TEST_KEY = 'test_node';
        const client = (0, redis_1.createClient)();
        await client.connect();
        await client.json.set(TEST_KEY, '.', { node: 4303 });
        const value = await client.json.get(TEST_KEY, {
            path: '.node',
        });
        console.log(`value of node: ${value}`);
        await client.quit();
    }
    catch (e) {
        console.error(e);
    }
}
redisJSONDemo();
//# sourceMappingURL=r.js.map