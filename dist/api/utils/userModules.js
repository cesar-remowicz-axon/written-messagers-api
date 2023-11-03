"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = require("../../global.config");
const mssql_1 = __importDefault(require("mssql"));
class Modules {
    static async getUserModules(req, res, next) {
        const path = req.path;
        if (path !== '/pointClients/api/v1/create/account') {
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            const authHeader = req.headers['authorization'];
            if (!connection || !authHeader) {
                return res.status(200).json({ message: null });
            }
            const modulesAvailable = await connection.query(`SELECT TOP 1 ${process.env['MS_COLUMN_FOR_USER_HIRED_MODULES']} FROM ${process.env['MS_TABLE_CONTAINER_USER_HIRED_MODULES']} WHERE 1 = 1 AND ${process.env['MS_COLUMN_ID_TO_SEARCH_USER_HIRED_MODULES']} = ${authHeader} ORDER BY ID DESC`).then((result) => result["recordset"]);
            await connection.close();
            if (!modulesAvailable[0]) {
                return res.status(200).json({ message: null });
            }
            for (const [key, value] of Object.entries(modulesAvailable[0])) {
                req.body[key] = value;
                "";
            }
        }
        return next();
    }
}
exports.default = Modules;
;
//# sourceMappingURL=userModules.js.map