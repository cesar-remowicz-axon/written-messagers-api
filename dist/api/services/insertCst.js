"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertCst = void 0;
const global_config_1 = require("../../global.config");
const mssql_1 = __importDefault(require("mssql"));
const insertCst = async (funcionario, numeroOdf, codigoPeca, revisao, numeroOperacao, codigoFilho, i) => {
    try {
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        const data = await connection.query(`INSERT INTO CST_ALOCACAO (ODF, NUMOPE, CODIGO, CODIGO_FILHO, QUANTIDADE, ENDERECO, ALOCADO, DATAHORA, USUARIO) VALUES (${numeroOdf}, ${numeroOperacao}, '${codigoPeca}', '${codigoFilho[i]}', ${revisao}, 'ADDRESS', NULL, GETDATE(), '${funcionario}')`).then((result) => result.rowsAffected);
        return !data || data.length <= 0 ? null : data;
    }
    catch (error) {
        console.log('Error on insert CST', error);
        return null;
    }
};
exports.insertCst = insertCst;
//# sourceMappingURL=insertCst.js.map