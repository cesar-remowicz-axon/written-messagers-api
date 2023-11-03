"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backProd = void 0;
const variableInicializer_1 = require("../services/variableInicializer");
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const verifyReq_1 = require("../utils/verifyReq");
const insert_1 = require("../services/insert");
const message_1 = require("../services/message");
const query_1 = require("../services/query");
const backProd = async (req, res) => {
    const params = await (0, verifyReq_1.verifyReq)({ body: req.body, cookies: req.cookies });
    if (!params) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(51), data: (0, message_1.message)(33), code: (0, message_1.message)(33) });
    }
    const vrbls = await (0, variableInicializer_1.inicializer)({ body: req.body, cookies: req.cookies });
    if (!vrbls['body'].supervisor) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(21), data: (0, message_1.message)(33), code: (0, message_1.message)(33) });
    }
    const hisa = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF: vrbls['cookies'].NUMERO_ODF, NUMERO_OPERACAO: Number(vrbls['cookies'].NUMERO_OPERACAO), CODIGO_MAQUINA: vrbls['cookies'].CODIGO_MAQUINA }, [7]);
    if (!hisa.accepted) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(0), data: (0, message_1.message)(33), code: hisa.code });
    }
    const resource = await (0, query_1.select)(10, { supervisor: vrbls['body'].supervisor });
    if (!resource) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(21), data: (0, message_1.message)(33), code: hisa.code });
    }
    const insertThree = await (0, insert_1.istInto)([3], vrbls['cookies'].FUNCIONARIO, vrbls['cookies'].NUMERO_ODF, vrbls['cookies'].CODIGO_PECA, vrbls['cookies'].REVISAO, vrbls['cookies'].NUMERO_OPERACAO, vrbls['cookies'].CODIGO_MAQUINA, vrbls['cookies'].QTDE_LIB, null, null, [`Ini Prod.`], new Date().getTime(), null, null, null);
    if (!insertThree) {
        return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(21), data: (0, message_1.message)(33), code: hisa.code });
    }
    return res.json({ status: (0, message_1.message)(1), message: (0, message_1.message)(1), data: (0, message_1.message)(33), code: hisa.code });
};
exports.backProd = backProd;
//# sourceMappingURL=stopSupervisor.js.map