"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopMotives = void 0;
const variableInicializer_1 = require("../services/variableInicializer");
const cookieGenerator_1 = require("../utils/cookieGenerator");
const verifyReq_1 = require("../utils/verifyReq");
const message_1 = require("../services/message");
const query_1 = require("../services/query");
const stopMotives = async (req, res) => {
    const data = {};
    data['message'] = (0, message_1.message)(33);
    data['code'] = (0, message_1.message)(33);
    const params = await (0, verifyReq_1.verifyReq)({ body: req['body'], cookies: req['cookies'] });
    if (!params) {
        data['message'] = (0, message_1.message)(51);
        return res.json(data);
    }
    const vb = await (0, variableInicializer_1.inicializer)({ body: req['body'], cookies: req['cookies'] });
    if (!vb) {
        return res.json(data);
    }
    const resultAvailable = await (0, query_1.select)("userAvailable", { COMPANY_ID: 9999 });
    let resource;
    if (!vb['cookies']['stopMotives']) {
        resource = await (0, query_1.select)(27);
        resource = resource.map((acc) => acc['DESCRICAO']);
        await (0, cookieGenerator_1.cookieGenerator)(res, { stopMotives: resource });
    }
    else {
        resource = vb['cookies']['stopMotives'].split(',');
    }
    Object.entries(resultAvailable[0]).forEach((acc) => {
        data[acc[0]] = acc[1];
    });
    Object.entries(resource[0]).forEach((acc) => {
        data[acc[0]] = acc[1];
    });
    return res.status(200).json(data);
};
exports.stopMotives = stopMotives;
//# sourceMappingURL=stopMotives.js.map