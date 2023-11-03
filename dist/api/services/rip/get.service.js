"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = __importDefault(require("mssql"));
const verifyCodeNote_1 = require("../../utils/verifyCodeNote");
const query_1 = require("../../utils/query");
const insert_1 = require("../../utils/insert");
const message_1 = require("../../utils/message");
const update_1 = require("../../utils/update");
const global_config_1 = require("../../../global.config");
class RipServiceGet {
    constructor() { }
    ;
    async get(req, res) {
        const apiResponse = req.body;
        let { RIP_MOD, FUNCIONARIO, NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, CODIGO_PECA, REVISAO, QTDE_LIB } = apiResponse;
        const arr = [];
        let insertStr = '';
        let updateStr = '';
        const codeNumberFive = 5;
        const codeNumberSix = 6;
        NUMERO_OPERACAO = String(Number(NUMERO_OPERACAO));
        CODIGO_MAQUINA = String(CODIGO_MAQUINA.replaceAll(' ', ''));
        NUMERO_ODF = String(NUMERO_ODF.replaceAll(' ', ''));
        CODIGO_PECA = String(CODIGO_PECA).replaceAll(' ', '');
        const allowedCharsToBeTested = [4, 5, 6];
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({ FUNCIONARIO, NUMERO_ODF, NUMERO_OPERACAO }, allowedCharsToBeTested);
        const { code, accepted } = hisaponta;
        if (!accepted) {
            return res.status(200).json(apiResponse);
        }
        apiResponse["code"] = code;
        if (RIP_MOD === 'TRUE') {
            const resource = await (0, query_1.select)("vwForRipData", { CODIGO_PECA, REVISAO, CODIGO_MAQUINA, });
            if (resource) {
                const resourceRIPPointed = await (0, query_1.select)('getParcialRipData', { odfNumber: NUMERO_ODF, machineName: CODIGO_MAQUINA, operationNumber: NUMERO_OPERACAO });
                const resourceObj = {
                    instrumento: [],
                    cstNumope: [],
                    descricao: [],
                    especif: [],
                    numCar: [],
                    lie: [],
                    lse: [],
                };
                for (let i = 0; i < resource['length']; i++) {
                    resourceObj.instrumento.push(`${resource[i]['INSTRUMENTO']}%%%`);
                    resourceObj.cstNumope.push(`${resource[i]['CST_NUMOPE']}%%%`);
                    resourceObj.descricao.push(`${resource[i]['DESCRICAO']}%%%`);
                    resourceObj.especif.push(`${resource[i]['ESPECIF']}%%%`);
                    resourceObj.numCar.push(`${resource[i]['NUMCAR']}%%%`);
                    resourceObj.lie.push(`${resource[i]['LIE']}%%%`);
                    resourceObj.lse.push(`${resource[i]['LSE']}%%%`);
                }
                res.cookie('instrumento', resourceObj.instrumento);
                res.cookie('cstNumope', resourceObj.cstNumope);
                res.cookie('descricao', resourceObj.descricao);
                res.cookie('especif', resourceObj.especif);
                res.cookie('numCar', resourceObj.numCar);
                res.cookie('lie', resourceObj.lie);
                res.cookie('lse', resourceObj.lse);
                apiResponse['result'] = resource;
            }
        }
        else {
            apiResponse['message'] = 'Modulo não suportado';
        }
        async function insertStatement(arrayOfPointCode, arrayOfPointFields, strCodeReturn) {
            insertStr = await (0, insert_1.insertInto)(arrayOfPointCode, FUNCIONARIO, Number(NUMERO_ODF), String(CODIGO_PECA), String(REVISAO), NUMERO_OPERACAO, String(CODIGO_MAQUINA), Number(QTDE_LIB), 0, 0, arrayOfPointFields, 0, null, 0, 0);
            apiResponse['code'] = (0, message_1.message)(`${strCodeReturn}`);
            return;
        }
        const PCP_PROGRAMACAO_PRODUCAO = 0;
        if (code === (0, message_1.message)('ProdFin')) {
            if (apiResponse['result'].length > 0) {
                await insertStatement([codeNumberFive], [`INI RIP`], 'RipIni');
            }
            else {
                await insertStatement([codeNumberFive, codeNumberSix], [`INI RIP`, 'FIN RIP'], 'RipFin');
            }
        }
        else if (code === (0, message_1.message)('RipIni') && !apiResponse['result']) {
            await insertStatement([codeNumberSix], ['FIN RIP'], 'RipFin');
            updateStr = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, { NUMERO_ODF: NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, });
        }
        if (updateStr) {
            arr.push(updateStr);
        }
        if (insertStr) {
            arr.push(insertStr);
        }
        if (arr.length <= 0) {
            return res.status(200).json(apiResponse);
        }
        try {
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            const resultInsertRip = await connection.query(`${arr.join('\n')}`).then((result) => result.rowsAffected);
            await connection.close();
            if (!resultInsertRip || resultInsertRip.length <= 0 || resultInsertRip[0] === 0) {
                apiResponse['code'] = null;
                apiResponse['message'] = (0, message_1.message)('ReqError');
                return res.status(200).json(apiResponse);
            }
            const groupOdf = (await (0, query_1.select)(0, {
                NUMERO_ODF,
            }));
            const indexOdf = groupOdf.findIndex((item) => {
                return (Number(item["NUMERO_OPERACAO"].replaceAll(' ', '')) ===
                    Number(NUMERO_OPERACAO));
            });
            const finalIndex = groupOdf.length - 1;
            if ((groupOdf[indexOdf]['QTDE_ODF'] === groupOdf[indexOdf]['QTDE_APONTADA']) && (indexOdf === finalIndex)) {
                await (0, query_1.select)("deleteOdfQuery", { NUMERO_ODF });
            }
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            console.log('Error on inserFive', error);
            return res.status(200).json(apiResponse);
        }
    }
}
exports.default = RipServiceGet;
//# sourceMappingURL=get.service.js.map