import mssql from "mssql";
import "dotenv/config";

export const sqlConfig: mssql.config = {
    user: process.env["DB_USER"]!,
    password: process.env["DB_PWD"],
    database: process.env["DB_SCHEMA"],
    server: process.env['host']!,
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