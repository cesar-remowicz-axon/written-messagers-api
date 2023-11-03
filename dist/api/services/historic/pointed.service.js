"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../../utils/message");
const unravelBarcode_1 = require("../../utils/unravelBarcode");
const query_1 = require("../../utils/query");
class HistoricServicePointed {
    constructor() { }
    ;
    async pointed(req, res) {
        const apiResponse = req.body;
        const detailHistoric = 5;
        const generalHistoric = 6;
        let { HISTORICO_MOD, NUMERO_ODF, barcode } = apiResponse;
        if (!NUMERO_ODF && !barcode) {
            apiResponse['message'] = (0, message_1.message)("ReqError");
            ;
            return res.status(200).json(apiResponse);
        }
        if (barcode && !NUMERO_ODF) {
            if (barcode['length'] <= 10) {
                NUMERO_ODF = barcode;
            }
            else if (barcode.length > 10) {
                ({ NUMERO_ODF } = await (0, unravelBarcode_1.unravelBarcode)({ barcode: barcode }));
            }
        }
        if (HISTORICO_MOD === 'FALSE') {
            apiResponse['message'] = (0, message_1.message)("NoModule");
            ;
            return res.status(200).json(apiResponse);
        }
        apiResponse['detail'] = await (0, query_1.select)(detailHistoric, { NUMERO_ODF });
        apiResponse['general'] = await (0, query_1.select)(generalHistoric, { NUMERO_ODF });
        return res.status(200).json(apiResponse);
    }
}
exports.default = HistoricServicePointed;
//# sourceMappingURL=pointed.service.js.map