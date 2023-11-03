"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopPost = void 0;
const variableInicializer_1 = require("../services/variableInicializer");
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const insert_1 = require("../services/insert");
const message_1 = require("../services/message");
const verifyReq_1 = require("../utils/verifyReq");
const query_1 = require("../services/query");
const stopPost = async (req, res) => {
    const params = await (0, verifyReq_1.verifyReq)({ supervisor: req.body.values.supervisor });
    if (!params) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(51), data: (0, message_1.message)(33), code: (0, message_1.message)(33) });
    }
    const vrbls = await (0, variableInicializer_1.inicializer)({ body: req.body, cookies: req.cookies });
    if (!vrbls['cookies'].NUMERO_ODF || !vrbls['cookies'].NUMERO_OPERACAO || !vrbls['cookies'].CODIGO_MAQUINA) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(0), data: (0, message_1.message)(33) });
    }
    const hisa = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF: vrbls['cookies'].NUMERO_ODF, NUMERO_OPERACAO: Number(vrbls['cookies'].NUMERO_OPERACAO), CODIGO_MAQUINA: vrbls['cookies'].CODIGO_MAQUINA }, [7]);
    const timeSpend = Number(new Date().getTime() - hisa.time) || 0;
    if (hisa.accepted) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(19), data: (0, message_1.message)(33), code: hisa.code });
    }
    console.log('suoper', vrbls['body'].supervisor);
    const resource = await (0, query_1.select)(10, { supervisor: vrbls['body'].supervisor });
    console.log('resource', resource);
    if (!resource) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(21), data: (0, message_1.message)(33), code: hisa.code });
    }
    const insertSeven = await (0, insert_1.istInto)([7], vrbls['cookies'].FUNCIONARIO, vrbls['cookies'].NUMERO_ODF, vrbls['cookies'].CODIGO_PECA, vrbls['cookies'].REVISAO, vrbls['cookies'].NUMERO_OPERACAO, vrbls['cookies'].CODIGO_MAQUINA, vrbls['cookies'].QTDE_LIB, null, null, ['Parada'], timeSpend, null, null, null);
    if (!insertSeven) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(0), data: (0, message_1.message)(33), code: hisa.code });
    }
    return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(1), data: (0, message_1.message)(33), code: hisa.code });
};
exports.stopPost = stopPost;
//# sourceMappingURL=stopPost.js.map