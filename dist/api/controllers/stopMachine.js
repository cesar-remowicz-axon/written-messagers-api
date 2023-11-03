"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopMachine = void 0;
const variableInicializer_1 = require("../services/variableInicializer");
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const verifyReq_1 = require("../utils/verifyReq");
const message_1 = require("../services/message");
const insert_1 = require("../services/insert");
const query_1 = require("../services/query");
const stopMachine = async (req, res) => {
    const data = {};
    data["code"] = (0, message_1.message)(33);
    data['message'] = (0, message_1.message)(33);
    const params = await (0, verifyReq_1.verifyReq)({ supervisor: req['body']['values']['supervisor'] });
    if (!params) {
        data['message'] = (0, message_1.message)(51);
        return res.status(200).json(data);
    }
    const vb = await (0, variableInicializer_1.inicializer)({ body: req['body'], cookies: req['cookies'] });
    if (!vb) {
        return res.status(200).json(data);
    }
    if (!vb['cookies']['NUMERO_ODF'] || !vb['cookies']['NUMERO_OPERACAO'] || !vb['cookies']['CODIGO_MAQUINA']) {
        data['message'] = (0, message_1.message)(19);
        return res.status(200).json(data);
    }
    const resultAvailable = await (0, query_1.select)("userAvailable", { COMPANY_ID: 9999 });
    const hisa = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF: vb['cookies']['NUMERO_ODF'], NUMERO_OPERACAO: Number(vb['cookies']['NUMERO_OPERACAO']), CODIGO_MAQUINA: vb['cookies']['CODIGO_MAQUINA'] }, [7]);
    data["code"] = hisa['code'];
    const timeSpend = Number(new Date().getTime() - hisa['time']) || 0;
    if (hisa['accepted']) {
        data['message'] = (0, message_1.message)(19);
        return res.status(200).json(data);
    }
    const resource = await (0, query_1.select)(10, { supervisor: vb['body']['supervisor'] });
    if (!resource) {
        return res.status(200).json({ data: (0, message_1.message)(21), code: hisa['code'] });
    }
    const insertSeven = await (0, insert_1.istInto)([7], vb['cookies']['FUNCIONARIO'], vb['cookies']['NUMERO_ODF'], vb['cookies']['CODIGO_PECA'], vb['cookies']['REVISAO'], vb['cookies']['NUMERO_OPERACAO'], vb['cookies']['CODIGO_MAQUINA'], vb['cookies']['QTDE_LIB'], null, null, ['Parada'], timeSpend, null, null, null);
    if (!insertSeven) {
        return res.status(200).json({ data: (0, message_1.message)(33), code: hisa['code'] });
    }
    Object.entries(resultAvailable[0]).forEach((acc) => {
        data[acc[0]] = acc[1];
    });
    Object.entries(resource[0]).forEach((acc) => {
        data[acc[0]] = acc[1];
    });
    return res.status(200).json(data);
};
exports.stopMachine = stopMachine;
//# sourceMappingURL=stopMachine.js.map