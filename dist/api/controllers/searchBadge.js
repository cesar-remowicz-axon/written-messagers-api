"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBagde = void 0;
const variableInicializer_1 = require("../services/variableInicializer");
const cookieGenerator_1 = require("../utils/cookieGenerator");
const clearCookie_1 = require("../utils/clearCookie");
const verifyReq_1 = require("../utils/verifyReq");
const message_1 = require("../services/message");
const query_1 = require("../services/query");
const searchBagde = async (req, res) => {
    const d = {};
    d['message'] = null;
    d['code'] = null;
    await (0, clearCookie_1.cookieCleaner)(res, req['cookies']);
    const p = await (0, verifyReq_1.verifyReq)({ badge: req['body']['badge'] });
    if (!p) {
        d['message'] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    const v = await (0, variableInicializer_1.inicializer)(req.body, req.cookies);
    if (!v) {
        d['message'] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    if (!v['badge']) {
        d['message'] = (0, message_1.message)("Nobadge");
        return res.status(200).json(d);
    }
    const ra = await (0, query_1.select)("userAvailable", { COMPANY_ID: req.query['COMPANY_ID'] });
    if (!ra) {
        d['message'] = "Erro ao localizar cliente";
        return res.status(200).json(d);
    }
    Object.entries(ra[0]).forEach((acc) => {
        d[acc[0]] = acc[1];
    });
    if (ra[0].EMPLOYEE_MOD === 'FALSE') {
        d['message'] = (0, message_1.message)("NoModule");
        ;
        return res.status(200).json(d);
    }
    const resource = await (0, query_1.select)(16, v);
    if (!resource) {
        d['message'] = (0, message_1.message)("Nobadge");
        return res.status(200).json(d);
    }
    Object.entries(resource[0]).map((acc) => {
        d[acc[0]] = acc[1];
    });
    await (0, cookieGenerator_1.cookieGenerator)(res, resource[0]);
    d['message'] = (0, message_1.message)("Success");
    return res.status(200).json(d);
};
exports.searchBagde = searchBagde;
//# sourceMappingURL=searchBadge.js.map