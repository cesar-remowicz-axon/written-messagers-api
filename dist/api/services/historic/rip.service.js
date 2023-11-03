"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = require("../../../global.config");
const message_1 = require("../../utils/message");
const unravelBarcode_1 = require("../../utils/unravelBarcode");
const mssql_1 = __importDefault(require("mssql"));
class HistoricServiceRip {
    constructor() { }
    ;
    async rip(req, res) {
        const apiResponse = req.body || null;
        const { barcode } = apiResponse;
        if (!apiResponse) {
            apiResponse['message'] = 'Erro na requisição';
            return res.status(200).json(apiResponse);
        }
        const unraveledBarcode = await (0, unravelBarcode_1.unravelBarcode)({ barcode });
        if (!unraveledBarcode['NUMERO_ODF']) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        try {
            const { NUMERO_ODF } = unraveledBarcode;
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            apiResponse['result'] = await connection.query(`
                        SELECT ${process.env['MS_COLUMN_FOR_FEED_OF_RIP']} FROM ${process.env['MS_TABLE_CONTAINER_POINTED_RIP']} WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' ORDER BY DATAHORA DESC`)
                .then((result) => result['recordset']);
            await connection.close();
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            apiResponse['message'] = 'Erro na requisição';
            return res.status(200).json(apiResponse);
        }
    }
}
exports.default = HistoricServiceRip;
//# sourceMappingURL=rip.service.js.map