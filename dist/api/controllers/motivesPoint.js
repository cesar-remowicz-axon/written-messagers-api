"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.motivesPoint = void 0;
const variableInicializer_1 = require("../services/variableInicializer");
const cookieGenerator_1 = require("../utils/cookieGenerator");
const message_1 = require("../services/message");
const query_1 = require("../services/query");
const motivesPoint = async (req, res) => {
    const d = {};
    d['code'] = null;
    d['message'] = null;
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
    if (ra[0].MOTIVOS_MOD === 'FALSE') {
        d['message'] = (0, message_1.message)("NoModule");
        ;
        return res.status(200).json(d);
    }
    let resource;
    if (!v['badFeedDescription']) {
        resource = await (0, query_1.select)(1);
        resource = resource.map((acc) => acc['DESCRICAO']);
        await (0, cookieGenerator_1.cookieGenerator)(res, { badFeedDescription: resource });
    }
    else {
        resource = v['badFeedDescription'].split(',');
    }
    let result;
    if (!v['stopMotives']) {
        result = await (0, query_1.select)(27);
        result = result.map((acc) => acc['DESCRICAO']);
        await (0, cookieGenerator_1.cookieGenerator)(res, { stopMotives: result });
    }
    else {
        result = v['stopMotives'].split(',');
    }
    let values;
    if (!v['returnMotives']) {
        values = await (0, query_1.select)(13);
        values = values.map((acc) => acc['DESCRICAO']);
        await (0, cookieGenerator_1.cookieGenerator)(res, { returnMotives: values });
    }
    else {
        values = v['returnMotives'].split(',');
    }
    d["badFeedDescription"] = resource;
    d["stopMotives"] = result;
    d["returnMotives"] = values;
    d['message'] = (0, message_1.message)("Success");
    return res.status(200).json(d);
};
exports.motivesPoint = motivesPoint;
//# sourceMappingURL=motivesPoint.js.map