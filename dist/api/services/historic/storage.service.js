"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../../utils/message");
const query_1 = require("../../utils/query");
class HistoricServiceStorage {
    constructor() { }
    ;
    async storage(req, res) {
        const apiResponse = req.body;
        const { barcode } = apiResponse;
        if (!barcode) {
            apiResponse['message'] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const resource = await (0, query_1.select)("historyStoragePointed", { NUMERO_ODF: barcode });
        if (!resource) {
            apiResponse['message'] = (0, message_1.message)("ReqError");
            return res.json(apiResponse);
        }
        apiResponse['result'] = resource;
        return res.status(200).json(apiResponse);
    }
}
exports.default = HistoricServiceStorage;
//# sourceMappingURL=storage.service.js.map