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
    const d = {};
    d["code"] = null;
    d['message'] = null;
    const p = await (0, verifyReq_1.verifyReq)({ supervisor: req['body']['values']['supervisor'] });
    if (!p) {
        d['message'] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    const v = await (0, variableInicializer_1.inicializer)(req.body, req.cookies);
    if (!v) {
        d['message'] = (0, message_1.message)("ReqError");
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
    if (ra[0].MOTIVOS === 'FALSE') {
        d['message'] = (0, message_1.message)("NoModule");
        ;
        return res.status(200).json(d);
    }
    const h = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF: v['NUMERO_ODF'], NUMERO_OPERACAO: Number(v['NUMERO_OPERACAO']), CODIGO_MAQUINA: v['CODIGO_MAQUINA'] }, [3, 7]);
    d["code"] = h['code'];
    if (h['accepted']) {
        d['message'] = (0, message_1.message)("Stopped");
        return res.status(200).json(d);
    }
    const resource = await (0, query_1.select)(10, { supervisor: v['supervisor'] });
    if (!resource) {
        d['message'] = (0, message_1.message)("Nobadge");
        return res.status(200).json(d);
    }
    Object.entries(resource[0]).forEach((acc) => {
        d[acc[0]] = acc[1];
    });
    if (h['code'] === (0, message_1.message)("ProdIni")) {
        const insertSeven = await (0, insert_1.istInto)([7], v['FUNCIONARIO'], v['NUMERO_ODF'], v['CODIGO_PECA'], v['REVISAO'], v['NUMERO_OPERACAO'], v['CODIGO_MAQUINA'], v['QTDE_LIB'], null, null, ['Parada'], 0, null, null, null);
        if (!insertSeven) {
            return res.status(200).json(d);
        }
        d['message'] = (0, message_1.message)("Stopped");
        d["code"] = (0, message_1.message)("Stopped");
    }
    else if (h['code'] === (0, message_1.message)("Stopped")) {
        const insertThree = await (0, insert_1.istInto)([3], v['FUNCIONARIO'], v['NUMERO_ODF'], v['CODIGO_PECA'], v['REVISAO'], v['NUMERO_OPERACAO'], v['CODIGO_MAQUINA'], v['QTDE_LIB'], null, null, [`Ini Prod.`], new Date().getTime(), null, null, null);
        if (!insertThree) {
            return res.status(200).json(d);
        }
        d['message'] = (0, message_1.message)("ProdIni");
        d["code"] = (0, message_1.message)("ProdIni");
    }
    else {
        d['message'] = 'Maq não esta parada ou em produção';
    }
    return res.status(200).json(d);
};
exports.stopMachine = stopMachine;
//# sourceMappingURL=machineProd.js.map