"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unravelBarcode_1 = require("../utils/unravelBarcode");
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const global_config_1 = require("../../global.config");
const message_1 = require("../services/message");
const insert_1 = require("../services/insert");
const update_1 = require("../services/update");
const query_1 = require("../services/query");
const mssql_1 = __importDefault(require("mssql"));
class Reversal {
    constructor() { }
    ;
    static async returnPoint(req, res) {
        const apiResponse = req.body || null;
        const { DEVOLUVAO_MOD, SUPERVISOR_MOD, RESERVA_MOD, supervisor } = apiResponse;
        const unraveledBarcode = await (0, unravelBarcode_1.unravelBarcode)({ barcode: apiResponse['barcode'] }) || null;
        if (!unraveledBarcode || !unraveledBarcode['NUMERO_ODF'] || !unraveledBarcode['NUMERO_OPERACAO'] || !unraveledBarcode['CODIGO_MAQUINA']) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF: unraveledBarcode['NUMERO_ODF'], NUMERO_OPERACAO: unraveledBarcode['NUMERO_OPERACAO'], FUNCIONARIO: apiResponse['FUNCIONARIO'] }, [6]);
        const { code, accepted } = hisaponta;
        apiResponse["code"] = code;
        if (!accepted) {
            apiResponse["message"] = "ODF não pode ser estornada";
            return res.status(200).json(apiResponse);
        }
        if (!apiResponse['quantity'] || Number.isNaN(Number(apiResponse['quantity']))) {
            apiResponse["message"] = "Quantidade de estorno inválida";
            return res.status(200).json(apiResponse);
        }
        if (apiResponse['valueStorage'] === 'BOAS') {
            apiResponse['pointGoodFeed'] = apiResponse['quantity'];
        }
        else if (apiResponse['valueStorage'] === 'RUINS') {
            apiResponse['pointBadFeed'] = apiResponse['quantity'];
        }
        const VW_APP_APTO_PROGRAMACAO_PRODUCAO = 0;
        const groupOdf = await (0, query_1.select)(VW_APP_APTO_PROGRAMACAO_PRODUCAO, { NUMERO_ODF: unraveledBarcode['NUMERO_ODF'] });
        const index = groupOdf.findIndex((item) => { return ('00' + String(item['NUMERO_OPERACAO']).replaceAll(' ', '0')) === String(unraveledBarcode['NUMERO_OPERACAO']); });
        const odf = groupOdf[index] || null;
        const ar = [];
        for (let i = 0; i < groupOdf.length; i++) {
            ar.push(groupOdf[i]['QTDE_APONTADA']);
        }
        let w = Math.min(...ar);
        let lastPointIndex = groupOdf.findIndex((item) => { return (item['QTDE_APONTADA'] === w); }) - 1;
        if (lastPointIndex === null || lastPointIndex === undefined) {
            return res.json(apiResponse);
        }
        if (lastPointIndex < 0) {
            lastPointIndex = groupOdf.length - 1;
        }
        if (lastPointIndex !== index) {
            apiResponse["message"] = (0, message_1.message)("NoDevo");
            return res.status(200).json(apiResponse);
        }
        if (odf['QTDE_APONTADA '] < Number((apiResponse['goodFeed'] || 0) + (apiResponse['badFeed'] || 0)) || odf['QTDE_APONTADA '] <= 0 || !odf['QTD_REFUGO'] && (apiResponse['badFeed'] || 0) > 0) {
            apiResponse["message"] = (0, message_1.message)("NoLimit");
            return res.json(apiResponse);
        }
        else if (!odf || '00' + odf['NUMERO_OPERACAO'].replaceAll(' ', '0') !== unraveledBarcode['NUMERO_OPERACAO']) {
            apiResponse["message"] = "ODF não pode ser estornada";
            return res.status(200).json(apiResponse);
        }
        if (index <= 0) {
            odf['QTDE_LIB'] = odf['QTDE_ODF '] - odf['QTDE_APONTADA '] - odf['QTD_FALTANTE'];
        }
        else {
            odf['QTDE_LIB'] = (odf['QTD_BOAS'] || 0) - (odf['QTD_BOAS'] || 0) - (odf['QTD_REFUGO'] || 0) - (odf['QTD_RETRABALHADA'] || 0) - (odf['QTD_FALTANTE'] || 0);
        }
        if (DEVOLUVAO_MOD === 'FALSE') {
            apiResponse["message"] = (0, message_1.message)("NoModule");
            ;
            return res.status(200).json(apiResponse);
        }
        if (SUPERVISOR_MOD === 'TRUE') {
            const VIEW_GRUPO_APT = 10;
            const resultSupervisor = await (0, query_1.select)(VIEW_GRUPO_APT, { supervisor });
            if (!resultSupervisor) {
                apiResponse["message"] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
        }
        if (apiResponse['quantity'] > odf['QTDE_ODF']) {
            apiResponse["message"] = (0, message_1.message)("Nobadge");
            return res.status(200).json(apiResponse);
        }
        const strQuery = [];
        try {
            if (RESERVA_MOD === 'TRUE') {
                const PROCESSO = 22;
                const resource = await (0, query_1.select)(PROCESSO, { NUMERO_ODF: unraveledBarcode['NUMERO_ODF'], NUMERO_OPERACAO: unraveledBarcode['NUMERO_OPERACAO'], });
                if (resource) {
                    const execut = resource.map((element) => element['EXECUT']);
                    const childCode = resource.map((item) => item['NUMITE']);
                    const process = resource.map((item) => item['NUMSEQ']).filter((element) => element === String(String(unraveledBarcode['NUMERO_OPERACAO']).replaceAll(' ', '')).replaceAll('000', ''));
                    if (process.length > 0) {
                        for (let i = 0; i < childCode.length; i++) {
                            strQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${apiResponse['quantity'] * execut[i]} WHERE 1 = 1 AND CODIGO = '${childCode[i]}'`);
                        }
                    }
                }
            }
            const insertEight = await (0, insert_1.istInto)([8], String(apiResponse['FUNCIONARIO']), Number(unraveledBarcode['NUMERO_ODF']), String(odf['CODIGO_PECA']), String(odf['REVISAO']), String(unraveledBarcode['NUMERO_OPERACAO'].replaceAll(' ', '').replaceAll('000', '')), String(unraveledBarcode['CODIGO_MAQUINA']), Number(odf['QTDE_LIB']), Number(apiResponse['goodFeed'] || 0), Number(apiResponse['badFeed'] || 0), ['ESTORNO'], 0, null, 0, 0);
            if (!insertEight) {
                return res.status(200).json(apiResponse);
            }
            const PCP_PROGRAMACAO_PRODUCAO = 2;
            const updatedStr = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, { CODIGO_PECA: String(odf['CODIGO_PECA']), valorApontado: apiResponse['quantity'], pointGoodFeed: apiResponse['pointGoodFeed'], missingFeed: 0, QTD_LIB: odf['QTDE_LIB'], pointBadFeed: apiResponse['pointBadFeed'], valorTotal: apiResponse['quantity'], NUMERO_ODF: unraveledBarcode['NUMERO_ODF'], NUMERO_OPERACAO: unraveledBarcode['NUMERO_OPERACAO'], CODIGO_MAQUINA: unraveledBarcode['CODIGO_MAQUINA'], });
            strQuery.push(updatedStr);
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            await connection.query(strQuery.join('\n')).then(result => result.rowsAffected);
            apiResponse["message"] = "Estornado";
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            console.log('Error on insertEight', error);
            return res.status(200).json(apiResponse);
        }
    }
}
exports.default = Reversal;
//# sourceMappingURL=returnedValue.js.map