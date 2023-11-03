"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../../utils/query");
class OdfServiceSearch {
    async search(req, res) {
        const apiResponse = req.body;
        const { barcode } = apiResponse;
        const alocationQuery = "SearchOdf";
        const resource = await (0, query_1.select)(alocationQuery, { barcode });
        if (!resource) {
            apiResponse["message"] = "Erro ao visualizar as ODFs";
            return res.status(200).json(apiResponse);
        }
        const buckets = {};
        for (let i = 0; i < resource["length"]; i++) {
            const odf = resource[i].NUMERO_ODF;
            if (!(odf in buckets)) {
                buckets[odf] = [];
            }
            buckets[odf].push(resource[i]);
        }
        apiResponse["result"] = buckets;
        return res.status(200).json(apiResponse);
    }
}
exports.default = OdfServiceSearch;
//# sourceMappingURL=odf.search.service.js.map