"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressLog = void 0;
const unravelBarcode_1 = require("../utils/unravelBarcode");
const message_1 = require("../services/message");
const query_1 = require("../services/query");
async function addressLog(req, res) {
    const apiResponse = req.body || null;
    const { barcode } = apiResponse;
    const HISTORICO_ENDERECO = 31;
    const { NUMERO_ODF, NUMERO_OPERACAO } = await (0, unravelBarcode_1.unravelBarcode)({ barcode });
    if (!NUMERO_ODF || !NUMERO_OPERACAO) {
        apiResponse['message'] = (0, message_1.message)("ReqError");
        return res.status(200).json(apiResponse);
    }
    const resource = await (0, query_1.select)(HISTORICO_ENDERECO, { NUMERO_ODF, NUMERO_OPERACAO });
    if (!resource) {
        return res.json(apiResponse);
    }
    apiResponse['result'] = resource;
    return res.status(200).json(apiResponse);
}
exports.addressLog = addressLog;
//# sourceMappingURL=addressLog.js.map