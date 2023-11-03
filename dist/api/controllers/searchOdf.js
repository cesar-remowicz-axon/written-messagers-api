"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchOdf = void 0;
const selectIfHasP_1 = require("../services/selectIfHasP");
const variableInicializer_1 = require("../services/variableInicializer");
const cookieGenerator_1 = require("../utils/cookieGenerator");
const unravelBarcode_1 = require("../utils/unravelBarcode");
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const verifyReq_1 = require("../utils/verifyReq");
const message_1 = require("../services/message");
const update_1 = require("../services/update");
const query_1 = require("../services/query");
const insert_1 = require("../services/insert");
const searchOdf = async (req, res) => {
    const d = {};
    d['code'] = null;
    d['message'] = null;
    const p = await (0, verifyReq_1.verifyReq)({ FUNCIONARIO: req['cookies']['FUNCIONARIO'], CRACHA: req['cookies']['CRACHA'], barcode: req['body']['barcode'] });
    if (!p) {
        d['message'] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    const v = await (0, variableInicializer_1.inicializer)(req.body, req.cookies);
    if (!v) {
        d['message'] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    const b = await (0, unravelBarcode_1.unravelBarcode)({ barcode: v['barcode'] });
    if (!b || !b['NUMERO_ODF'] || !b['NUMERO_OPERACAO'] || !b['CODIGO_MAQUINA']) {
        d['message'] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    const go = await (0, query_1.select)(0, { NUMERO_ODF: b['NUMERO_ODF'], });
    if (!go) {
        d['message'] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    const i = go.findIndex((item) => { return ('00' + String(item['NUMERO_OPERACAO']).replaceAll(' ', '0')) === String(b['NUMERO_OPERACAO']); });
    const odf = go[i] || null;
    if (!odf) {
        d['message'] = (0, message_1.message)("ReqError");
        return res.status(200).json(d);
    }
    if (i <= 0) {
        odf['QTDE_LIB'] = odf['QTDE_ODF'] - ((odf['QTD_BOAS'] || 0) + (odf['QTD_REFUGO'] || 0) + (odf['QTD_RETRABALHADA'] || 0) + (odf['QTD_FALTANTE'] || 0));
    }
    else {
        odf['QTDE_LIB'] = (go[i - 1]['QTD_BOAS'] || 0) - (odf['QTD_BOAS'] || 0) - (odf['QTD_REFUGO'] || 0) - (odf['QTD_RETRABALHADA'] || 0) - (odf['QTD_FALTANTE'] || 0);
    }
    const ra = await (0, query_1.select)("userAvailable", { COMPANY_ID: req.query['COMPANY_ID'] });
    if (!ra) {
        d['message'] = "Erro ao localizar cliente";
        return res.status(200).json(d);
    }
    Object.entries(ra[0]).forEach((acc) => {
        d[acc[0]] = acc[1];
    });
    const h = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF: b['NUMERO_ODF'], NUMERO_OPERACAO: b['NUMERO_OPERACAO'], FUNCIONARIO: v['FUNCIONARIO'] }, [1, 3, 6, 9]);
    d['code'] = h['code'];
    if (odf['QTDE_APONTADA'] === odf['QTDE_ODF']) {
        await (0, cookieGenerator_1.cookieGenerator)(res, odf);
        d['message'] = (0, message_1.message)("Pointed");
        return res.status(200).json(d);
    }
    if (!odf['QTDE_LIB'] || odf['QTDE_LIB'] <= 0) {
        d['message'] = (0, message_1.message)("NoLimit");
        return res.status(200).json(d);
    }
    if (ra[0].RESERVA_MOD === 'TRUE') {
        const cpt = await (0, selectIfHasP_1.checkForComponents)({ NUMERO_ODF: b['NUMERO_ODF'], NUMERO_OPERACAO: b['NUMERO_OPERACAO'], CODIGO_PECA: String(odf['CODIGO_PECA']), QTDE_LIB: odf['QTDE_LIB'], FUNCIONARIO: v['FUNCIONARIO'], });
        if (cpt['message'] === (0, message_1.message)("NoLimit")) {
            d['message'] = `Sem quantidade para apontamento : ${cpt['semLimite']}`;
            return res.status(200).json(d);
        }
        else if (cpt['message'] === (0, message_1.message)("Success")) {
            odf['condic'] = cpt['condic'];
            odf['execut'] = cpt['execut'];
            odf['childCode'] = cpt['childCode'];
            odf['QTDE_LIB'] = !cpt['quantidade'] ? odf['QTDE_LIB'] : cpt['quantidade'];
            await (0, update_1.update)(1, { QTDE_LIB: odf['QTDE_LIB'], NUMERO_ODF: b['NUMERO_ODF'], NUMERO_OPERACAO: b['NUMERO_OPERACAO'], });
        }
    }
    console.log('V', v);
    if (h['code'] === (0, message_1.message)("RipFin") || h['code'] === (0, message_1.message)("Return")) {
        console.log('Inserindo insert 1');
        if (ra[0].FERRAMENTA_MOD === 'TRUE') {
            const insertOne = await (0, insert_1.istInto)([1], String(v['FUNCIONARIO']), Number(odf['NUMERO_ODF']), String(odf['CODIGO_PECA']), String(odf['REVISAO']), String(odf['NUMERO_OPERACAO'].replaceAll(' ', '')), String(odf['CODIGO_MAQUINA']), Number(odf['QTDE_LIB']), null, null, ["INI SETUP"], new Date().getTime(), null, null, null);
            if (!insertOne || insertOne.length <= 0) {
                d['message'] = "Erro ao iniciar o apontamento";
                d['code'] = "EMPLOYEE";
                return res.status(200).json(d);
            }
        }
        if (ra[0].FERRAMENTA_MOD === 'FALSE') {
            const insertTwoAndThree = await (0, insert_1.istInto)([1, 2, 3], String(v['FUNCIONARIO']), Number(odf['NUMERO_ODF']), String(odf['CODIGO_PECA']), String(odf['REVISAO']), String(odf['NUMERO_OPERACAO'].replaceAll(' ', '')), String(odf['CODIGO_MAQUINA']), Number(odf['QTDE_LIB']), null, null, ["INI SETUP", 'FIN SETUP', 'INI PROD'], new Date().getTime(), null, null, null);
            d['message'] = (0, message_1.message)("Success");
            if (!insertTwoAndThree || insertTwoAndThree.length < 0) {
                d['message'] = "Erro ao finalizar setup";
                return res.status(200).json(d);
            }
            d['code'] = (0, message_1.message)("SetupFin");
        }
        d['code'] = (0, message_1.message)("SetupIni");
    }
    await (0, cookieGenerator_1.cookieGenerator)(res, odf);
    d['message'] = (0, message_1.message)("Success");
    return res.status(200).json(d);
};
exports.searchOdf = searchOdf;
//# sourceMappingURL=searchOdf.js.map