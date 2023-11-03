"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnMotives = void 0;
const clearCookie_1 = require("../utils/clearCookie");
const message_1 = require("../services/message");
const query_1 = require("../services/query");
const returnMotives = async (req, res) => {
    await (0, clearCookie_1.cookieCleaner)(res, req['cookies']);
    req.body.companyId = 9999;
    const resourceAvailable = await (0, query_1.select)("userAvailable", { COMPANY_ID: req.body.companyId });
    return res.status(200).json({ message: (0, message_1.message)(1), data: resourceAvailable || (0, message_1.message)(33) });
};
exports.returnMotives = returnMotives;
//# sourceMappingURL=returnMotives.js.map