"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipAdd = void 0;
const ipAdd = async () => {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    const results = {};
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    const ip = String(Object.entries(results)[0][1]);
    return ip;
};
exports.ipAdd = ipAdd;
//# sourceMappingURL=ipFunc.js.map