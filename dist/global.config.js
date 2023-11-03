"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlConfig = void 0;
require("dotenv/config");
exports.sqlConfig = {
    user: process.env["DB_USER"],
    password: process.env["DB_PWD"],
    database: process.env["DB_SCHEMA"],
    server: process.env['host'],
    pool: {
        max: 15,
        min: 1,
        idleTimeoutMillis: 600000,
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};
//# sourceMappingURL=global.config.js.map