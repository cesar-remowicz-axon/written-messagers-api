"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RipLogs = void 0;
const unravelBarcode_1 = require("../utils/unravelBarcode");
const global_config_1 = require("../../global.config");
const mssql_1 = __importDefault(require("mssql"));
const message_1 = require("../services/message");
class RipLogs {
    constructor() { }
    ;
}
exports.RipLogs = RipLogs;
_a = RipLogs;
RipLogs.ripHistoric = async (req, res) => {
    const apiResponse = req.body || null;
    if (!apiResponse) {
        apiResponse['message'] = 'Erro na requisição';
        return res.status(200).json(apiResponse);
    }
    const unraveledBarcode = await (0, unravelBarcode_1.unravelBarcode)({ barcode: apiResponse['barcode'] }) || null;
    if (!unraveledBarcode['NUMERO_ODF']) {
        apiResponse["message"] = (0, message_1.message)("ReqError");
        return res.status(200).json(apiResponse);
    }
    try {
        const { NUMERO_ODF } = unraveledBarcode;
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        apiResponse['result'] = await connection.query(`
                        SELECT ODF, DESCRICAO, ESPECIFICACAO, DATAHORA, FUNCIONARIO, LIE, LSE, SETUP, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12, M13 FROM CST_RIP_ODF_PRODUCAO WHERE 1 = 1 AND ODF = '${NUMERO_ODF}'`)
            .then((result) => result['recordset']);
        return res.status(200).json(apiResponse);
    }
    catch (error) {
        apiResponse['message'] = 'Erro na requisição';
        return res.status(200).json(apiResponse);
    }
};
//# sourceMappingURL=ripLog.js.map