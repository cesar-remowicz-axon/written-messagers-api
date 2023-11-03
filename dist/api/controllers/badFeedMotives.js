"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badFeedMotives = void 0;
const variableInicializer_1 = require("../services/variableInicializer");
const cookieGenerator_1 = require("../utils/cookieGenerator");
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const verifyReq_1 = require("../utils/verifyReq");
const message_1 = require("../services/message");
const query_1 = require("../services/query");
const badFeedMotives = async (req, res) => {
    const params = await (0, verifyReq_1.verifyReq)({ body: req['body'], cookies: req['cookies'] });
    if (!params) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(51), data: (0, message_1.message)(33), code: (0, message_1.message)(33) });
    }
    const vrb = await (0, variableInicializer_1.inicializer)({ body: req['body'], cookies: req['cookies'] });
    if (!vrb) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(0), data: (0, message_1.message)(33), code: (0, message_1.message)(33) });
    }
    const hisa = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF: vrb['cookies']['NUMERO_ODF'], NUMERO_OPERACAO: Number(vrb['cookies']['NUMERO_OPERACAO']), CODIGO_MAQUINA: vrb['cookies']['CODIGO_MAQUINA'] }, [3, 4, 5, 6, 7]);
    if (!hisa.accepted) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(0), data: (0, message_1.message)(33), code: (0, message_1.message)(33) });
    }
    let resource;
    if (!vrb['cookies']['badFeedDescription']) {
        resource = await (0, query_1.select)(1);
        resource = resource.map((acc) => acc['DESCRICAO']);
        await (0, cookieGenerator_1.cookieGenerator)(res, { badFeedDescription: resource });
    }
    else {
        resource = vrb['cookies']['badFeedDescription'].split(',');
    }
    return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(1), data: resource, code: hisa['code'] });
};
exports.badFeedMotives = badFeedMotives;
//# sourceMappingURL=badFeedMotives.js.map