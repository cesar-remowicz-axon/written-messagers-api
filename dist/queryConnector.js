"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolConnection = void 0;
const global_config_1 = require("./global.config");
const mssql_1 = __importDefault(require("mssql"));
const poolConnection = async () => {
    return await new mssql_1.default.ConnectionPool(global_config_1.sqlConfig).connect().then(pool => { return pool; });
};
exports.poolConnection = poolConnection;
//# sourceMappingURL=queryConnector.js.map