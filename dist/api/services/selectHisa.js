"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.select = void 0;
const mssql_1 = __importDefault(require("mssql"));
const global_config_1 = require("../../global.config");
const select = async (table, top, column, where, orderBy) => {
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    let response = {};
    const data = await connection.query(`
    SELECT
    ${top}
    ${column}
    FROM 
    ${table}
    (NOLOCK)
    WHERE 1 = 1
    ${where}
    ${orderBy}
    `).then((result) => result.recordset);
    if (data.length <= 0) {
        return response.message = "odf nao encontrada";
    }
    if (data.length >= 0) {
        return response.data = data;
    }
    else {
        return response.message = 'Algo deu errado';
    }
};
exports.select = select;
//# sourceMappingURL=selectHisa.js.map