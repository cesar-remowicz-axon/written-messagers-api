"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feed = void 0;
const variableInicializer_1 = require("../services/variableInicializer");
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const verifyReq_1 = require("../utils/verifyReq");
const message_1 = require("../services/message");
const query_1 = require("../services/query");
const pictures_1 = require("../pictures");
const insert_1 = require("../services/insert");
const feed = async (req, res) => {
    const d = {};
    const result = [];
    d["message"] = null;
    d["code"] = null;
    const p = await (0, verifyReq_1.verifyReq)({ FUNCIONARIO: req['cookies']['FUNCIONARIO'], CRACHA: req['cookies']['CRACHA'], NUMERO_ODF: req['cookies']['NUMERO_ODF'], NUMERO_OPERACAO: req['cookies']['NUMERO_OPERACAO'] });
    if (!p) {
        d["message"] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    const v = await (0, variableInicializer_1.inicializer)(req.body, req.cookies);
    if (!v) {
        d["message"] = (0, message_1.message)("ReqError");
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
    const h = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF: v['NUMERO_ODF'], NUMERO_OPERACAO: Number(v['NUMERO_OPERACAO']), CODIGO_MAQUINA: v['CODIGO_MAQUINA'] }, [2, 3, 4, 5, 6, 7]);
    d["code"] = h['code'];
    if (!h['accepted']) {
        return res.status(200).json(d);
    }
    if (h['code'] === (0, message_1.message)('SetupFin')) {
        const insertThree = await (0, insert_1.istInto)([3], String(v['FUNCIONARIO']), Number(v['NUMERO_ODF']), String(v['CODIGO_PECA']), String(v['REVISAO']), String(v['NUMERO_OPERACAO']), String(v['CODIGO_MAQUINA']), Number(v['QTDE_LIB']), null, null, ['INI PROD'], new Date().getTime(), null, null, null);
        d['code'] = (0, message_1.message)("ProdIni");
        if (!insertThree || insertThree.length <= 0) {
            d['code'] = (0, message_1.message)("SetupFin");
            d['message'] = "Erro ao Iniciar produção";
        }
    }
    const resource = await (0, query_1.select)(42, { NUMERO_ODF: String(v['NUMERO_ODF']), NUMERO_OPERACAO: String(v['NUMERO_OPERACAO'].replaceAll(' ', '')), CODIGO_MAQUINA: String(v['CODIGO_MAQUINA']), REVISAO: String(v['REVISAO']), CODIGO_PECA: String(v['CODIGO_PECA']) });
    if (!resource) {
        d["message"] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    if (ra[0].DESENHO_TECNICO_MOD === 'TRUE') {
        for await (const [i, record] of Object.entries(resource)) {
            const rec = await record;
            const path = await pictures_1.pictures.getPicturePath(rec['NUMPEC'], rec['IMAGEM'], String('_status'), String(i));
            result.push(path);
        }
        resource[0]['IMAGEM'] = result;
    }
    if (ra[0].EMPLOYEE_MOD === 'TRUE') {
        resource[0]['FUNCIONARIO'] = v['FUNCIONARIO'];
    }
    resource[0]['EXECUT'] = Number(resource[0]['EXECUT'] * v['QTDE_LIB'] * 1000 - (Number(new Date().getTime() - h['time']))) || 0;
    if (ra[0].SUPERVISOR_MOD === 'TRUE') {
        if (v['supervisor']) {
            resource[0]['VERIFICADO'] = true;
        }
    }
    Object.entries(resource[0]).forEach((acc) => {
        d[acc[0]] = acc[1];
    });
    d['message'] = "Sucesso";
    return res.status(200).json(d);
};
exports.feed = feed;
//# sourceMappingURL=feedData.js.map