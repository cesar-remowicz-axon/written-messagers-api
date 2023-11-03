"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../../utils/query");
class PartsServiceStorage {
    async get(req, res) {
        const apiResponse = req.body;
        const { part } = apiResponse;
        apiResponse.partAddress = [];
        apiResponse.part = [];
        const resourceStorage = await (0, query_1.select)('partStorage', { part });
        const resourceAddress = await (0, query_1.select)('addressPerPart', { part });
        for (let i = 0; i < resourceAddress.length; i++) {
            const date = resourceAddress[i].date;
            const day = date.getUTCDate().toString().padStart(2, '0');
            ;
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            ;
            const year = date.getUTCFullYear();
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const hours = date.getUTCHours().toString().padStart(2, '0');
            resourceAddress[i].date = day + "/" + month + "/" + year;
            resourceAddress[i].time = hours + "h" + ":" + minutes;
        }
        apiResponse.partAddress = !resourceAddress ? [] : resourceAddress;
        apiResponse.part = !resourceStorage ? [] : resourceStorage;
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = PartsServiceStorage;
//# sourceMappingURL=storage.service.js.map