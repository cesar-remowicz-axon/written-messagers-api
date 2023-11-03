"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const insertNewOrder_1 = require("../services/insertNewOrder");
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const getAddress_1 = require("../services/getAddress");
const sendEmail_1 = require("../utils/sendEmail");
const global_config_1 = require("../../global.config");
const message_1 = require("../services/message");
const insert_1 = require("../services/insert");
const update_1 = require("../services/update");
const query_1 = require("../services/query");
const ipFunc_1 = require("../services/ipFunc");
const mssql_1 = __importDefault(require("mssql"));
const cookieGenerator_1 = require("../utils/cookieGenerator");
const unravelBarcode_1 = require("../utils/unravelBarcode");
const selectIfHasP_1 = require("../services/selectIfHasP");
class Odf {
    constructor() { }
    ;
    static async point(req, res) {
        const apiResponse = req.body || null;
        const ip = await (0, ipFunc_1.ipAdd)();
        let estoqueModule = false;
        const strQuery = [];
        const { NUMERO_OPERACAO, CODIGO_PECA, CODIGO_MAQUINA, FUNCIONARIO, pointGoodFeed, NUMERO_ODF, QTDE_LIB, execut, childCode, ESTOQUE_MOD, ENDERECO_MOD, RIP_MOD, EMPLOYEE_MOD, SUPERVISOR_MOD, EMAIL_MOD, REVISAO } = apiResponse;
        const codeNumberOne = 1;
        const codeNumberTwo = 2;
        const codeNumberThree = 3;
        const codeNumberFour = 4;
        const codeNumberFive = 5;
        const codeNumberSix = 6;
        const lastProcessOperationNumber = '999';
        const allowedCodePointed = [3];
        const PCP_PROGRAMACAO_PRODUCAO = 3;
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({
            NUMERO_ODF, NUMERO_OPERACAO: Number(NUMERO_OPERACAO), CODIGO_MAQUINA
        }, allowedCodePointed);
        const { code, accepted, employee } = hisaponta;
        apiResponse["code"] = code;
        if (!accepted) {
            apiResponse["message"] = (0, message_1.message)("Pointed");
            return res.status(200).json(apiResponse);
        }
        const totalValue = (Number(pointGoodFeed) || 0) + (Number(apiResponse['pointBadFeed']) || 0) + (Number(apiResponse['pointReworkFeed']) || 0) + (Number(apiResponse['pointMissingFeed']) || 0);
        const released = Number(QTDE_LIB) - Number(totalValue);
        if (!totalValue) {
            return res.status(200).json(apiResponse);
        }
        if (SUPERVISOR_MOD === 'TRUE') {
            if (apiResponse['pointBadFeed'] > 0 && !apiResponse['supervisor']) {
                apiResponse["message"] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            if (apiResponse['pointBadFeed'] > 0 && apiResponse['supervisor'] || released > 0) {
                const VIEW_GRUPO_APT = 10;
                const findSupervisor = await (0, query_1.select)(VIEW_GRUPO_APT, { supervisor: apiResponse['supervisor'] });
                if (!findSupervisor) {
                    apiResponse["message"] = "Crachá não encontrado";
                    return res.status(200).json(apiResponse);
                }
            }
        }
        if (released < 0) {
            apiResponse['message'] = 'Quantidade apontada excede o limite';
            return res.status(200).json(apiResponse);
        }
        if (EMAIL_MOD === 'TRUE') {
            if (apiResponse['pointReworkFeed'] > 0 || apiResponse['pointMissingFeed'] > 0) {
                await (0, sendEmail_1.createNewOrder)(NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, apiResponse['pointReworkFeed'], apiResponse['pointMissingFeed'], apiResponse['pointGoodFeed'], apiResponse['pointBadFeed'], totalValue, apiResponse['QTDE_ODF'], apiResponse['CODIGO_CLIENTE'], apiResponse['CODIGO_PECA']);
                await (0, insertNewOrder_1.insertIntoNewOrder)(0, NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, apiResponse['QTDE_ODF'], released, totalValue, apiResponse['pointBadFeed'], apiResponse['pointGoodFeed'], apiResponse['pointReworkFeed'], apiResponse['pointMissingFeed'], CODIGO_PECA, apiResponse['CODIGO_CLIENTE'], FUNCIONARIO, REVISAO);
            }
        }
        if (ESTOQUE_MOD === 'TRUE') {
            estoqueModule = true;
        }
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        if (ENDERECO_MOD === 'TRUE') {
            if (NUMERO_OPERACAO === lastProcessOperationNumber) {
                apiResponse['address'] = await (0, getAddress_1.getAddress)(REVISAO, CODIGO_MAQUINA, totalValue, [CODIGO_PECA]);
                const { address } = apiResponse;
                const HISREAL = 29;
                const resource = await (0, query_1.select)(HISREAL, { address, partCode: CODIGO_PECA, quantityToProduce: QTDE_LIB, NUMERO_ODF, });
                strQuery.push(`INSERT INTO HISTORICO_ENDERECO (DATAHORA, ODF, QUANTIDADE,CODIGO_PECA, CODIGO_FILHO, ENDERECO_ATUAL, STATUS, NUMERO_OPERACAO) VALUES (GETDATE(), '${NUMERO_ODF}', ${pointGoodFeed}, ${CODIGO_PECA}, ${null}, '${apiResponse['address']}', 'APONTADO', '${NUMERO_OPERACAO}')`);
                strQuery.push(`INSERT INTO HISREAL (CODIGO, DOCUMEN, DTRECEB, QTRECEB, VALPAGO, FORMA, SALDO, DATA, LOTE, USUARIO, ODF, NOTA, LOCAL_ORIGEM, LOCAL_DESTINO, CUSTO_MEDIO, CUSTO_TOTAL, CUSTO_UNITARIO, CATEGORIA, DESCRICAO, EMPRESA_RECNO, ESTORNADO_APT_PRODUCAO, CST_ENDERECO, VERSAOSISTEMA, CST_SISTEMA,CST_HOSTNAME,CST_IP)  SELECT      CODIGO, '${NUMERO_ODF}/${CODIGO_PECA}', GETDATE(), ${pointGoodFeed}, 0 , 'E', ${!resource || resource[0] === 0 || !resource[0].SALDO ? pointGoodFeed : resource[0].SALDO} + ${pointGoodFeed}, GETDATE(), '0', '${FUNCIONARIO}', '${NUMERO_ODF}', '0', '0', '0', 0, 0, 0, '0', 'DESCRI', 1, 'E', '${apiResponse['address']}', 1.00, 'APONTAMENTO', '${req.get('host')}', '${ip}' FROM ESTOQUE(NOLOCK) WHERE 1 = 1  AND CODIGO = '${CODIGO_PECA}'  GROUP BY CODIGO`);
                strQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${pointGoodFeed} WHERE 1 = 1 AND CODIGO = '${CODIGO_PECA}'`);
                const arrUpdateCstFather = [`UPDATE CST_ESTOQUE_ENDERECOS SET QUANTIDADE = COALESCE(QUANTIDADE, 0) + ${pointGoodFeed}, DATAHORA = GETDATE(), ODF = '${NUMERO_ODF}', ENDERECO = '${apiResponse['address']}' WHERE 1 = 1 AND CODIGO = '${CODIGO_PECA}' `];
                const resultUpdateCstFather = await connection.query(arrUpdateCstFather.join('\n')).then(result => result.rowsAffected);
                if (!resultUpdateCstFather || resultUpdateCstFather.length <= 0 || resultUpdateCstFather[0] === 0) {
                    strQuery.push(`INSERT INTO CST_ESTOQUE_ENDERECOS (CODIGO, ENDERECO, QUANTIDADE, ODF, DATAHORA) VALUES ('${CODIGO_PECA}',  '${apiResponse['address']}',  ${pointGoodFeed}, '${NUMERO_ODF}', GETDATE())`);
                }
            }
            if (childCode && childCode.length > 0) {
                for (let i = 0; i < childCode.length; i++) {
                    if (released > 0) {
                        if (estoqueModule === true) {
                            strQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${(Number(execut[i]) * Number(QTDE_LIB)) - (Number(totalValue) * Number(execut[i]))} WHERE 1 = 1 AND CODIGO = '${childCode[i]}'`);
                        }
                    }
                    if (estoqueModule === true) {
                        strQuery.push(`DELETE CST_ALOCACAO WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' AND CODIGO_FILHO = '${childCode[i]}'`);
                    }
                }
            }
        }
        let insert;
        if (RIP_MOD === 'TRUE') {
            if (EMPLOYEE_MOD === 'TRUE') {
                if (FUNCIONARIO !== employee) {
                    insert = await (0, insert_1.istInto)([codeNumberFour, codeNumberFive, codeNumberSix], employee, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, apiResponse['pointGoodFeed'], apiResponse['pointBadFeed'], ['FIN PROD', 'INI RIP', 'FIN RIP'], apiResponse['tempoDecorrido'], apiResponse['selectedMotive'] || null, apiResponse['pointMissingFeed'], apiResponse['pointReworkFeed']);
                    insert = await (0, insert_1.istInto)([codeNumberOne, codeNumberTwo, codeNumberThree, codeNumberFour, codeNumberFive], FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, apiResponse['pointGoodFeed'], apiResponse['pointBadFeed'], ['INI SETUP', 'FIN SETUP', 'INI PROD', 'FIN PROD', 'INI RIP'], apiResponse['tempoDecorrido'], apiResponse['selectedMotive'] || null, apiResponse['pointMissingFeed'], apiResponse['pointReworkFeed']);
                }
                else {
                    insert = await (0, insert_1.istInto)([codeNumberFour, codeNumberFive], FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, apiResponse['pointGoodFeed'], apiResponse['pointBadFeed'], ['FIN PROD', 'INI RIP'], apiResponse['tempoDecorrido'], apiResponse['selectedMotive'] || null, apiResponse['pointMissingFeed'], apiResponse['pointReworkFeed']);
                }
            }
            else {
                insert = await (0, insert_1.istInto)([codeNumberFour, codeNumberFive], FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, Number(apiResponse['QTDE_LIB']), apiResponse['pointGoodFeed'], apiResponse['pointBadFeed'], ['FIN PROD', `INI RIP`], 0, apiResponse['selectedMotive'] || null, apiResponse['pointMissingFeed'], apiResponse['pointReworkFeed']);
            }
            apiResponse["code"] = (0, message_1.message)("RipIni");
        }
        else {
            if (EMPLOYEE_MOD === 'TRUE') {
                if (FUNCIONARIO !== employee) {
                    insert = await (0, insert_1.istInto)([codeNumberFour, codeNumberFive, codeNumberSix], employee, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, apiResponse['pointGoodFeed'], apiResponse['pointBadFeed'], ['FIN PROD', 'INI RIP', 'FIN RIP'], apiResponse['tempoDecorrido'], apiResponse['selectedMotive'] || null, apiResponse['pointMissingFeed'], apiResponse['pointReworkFeed']);
                    insert = await (0, insert_1.istInto)([codeNumberOne, codeNumberTwo, codeNumberThree, codeNumberFour, codeNumberFive, codeNumberSix], FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, apiResponse['pointGoodFeed'], apiResponse['pointBadFeed'], ['INI SETUP', 'FIN SETUP', 'INI PROD', 'FIN PROD', 'INI RIP', 'FIN RIP'], apiResponse['tempoDecorrido'], apiResponse['selectedMotive'] || null, apiResponse['pointMissingFeed'], apiResponse['pointReworkFeed']);
                }
                else {
                    insert = await (0, insert_1.istInto)([codeNumberFour, codeNumberFive, codeNumberSix], FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, apiResponse['pointGoodFeed'], apiResponse['pointBadFeed'], ['FIN PROD', 'INI RIP', 'FIN RIP'], apiResponse['tempoDecorrido'], apiResponse['selectedMotive'] || null, apiResponse['pointMissingFeed'], apiResponse['pointReworkFeed']);
                }
            }
            else {
                insert = await (0, insert_1.istInto)([codeNumberFour, codeNumberFive, codeNumberSix], FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, Number(apiResponse['QTDE_LIB']), apiResponse['pointGoodFeed'], apiResponse['pointBadFeed'], ['FIN PROD', `INI RIP`, 'FIN RIP'], 0, apiResponse['selectedMotive'] || null, apiResponse['pointMissingFeed'], apiResponse['pointReworkFeed']);
            }
            apiResponse["code"] = (0, message_1.message)("RipFin");
            const PCP_PROGRAMACAO_PRODUCAO = 0;
            const finalTimer = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, });
            strQuery.push(finalTimer);
        }
        try {
            const resource = await (0, query_1.select)("VW_APP_APTO_PROGRAMACAO_PRODUCAO", {
                REVISAO,
                NUMERO_ODF,
                CODIGO_PECA,
                CODIGO_MAQUINA,
                NUMERO_OPERACAO: String(NUMERO_OPERACAO.replaceAll(' ', '')),
            });
            const { QTD_BOAS, QTDE_LIB, QTD_REFUGO, QTDE_APONTADA, QTDE_ODF } = resource[0];
            const updatePcpStr = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, {
                valorApontado: totalValue,
                released: QTDE_LIB,
                pointBadFeed: apiResponse['pointBadFeed'],
                pointGoodFeed: apiResponse['pointGoodFeed'],
                pointReworkFeed: apiResponse['pointReworkFeed'],
                pointMissingFeed: apiResponse['pointMissingFeed'],
                NUMERO_ODF,
                NUMERO_OPERACAO,
                CODIGO_MAQUINA,
            });
            strQuery.push(insert);
            strQuery.push(updatePcpStr);
            await connection.query(strQuery.join('\n').replaceAll(",INSERT", " INSERT")).then((result) => result.rowsAffected);
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            apiResponse['message'] = 'Tempo excedido';
            console.log("Timeout linha 210:", error);
            return res.status(200).json(apiResponse);
        }
    }
    static async data(req, res) {
        const apiResponse = req.body || null;
        const { barcode, ESTOQUE_MOD, FERRAMENTA_MOD, FUNCIONARIO } = apiResponse;
        const { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA } = await (0, unravelBarcode_1.unravelBarcode)({ barcode });
        const VW_APP_APTO_PROGRAMACAO_PRODUCAO = 0;
        const allowedCodePointed = [1, 3, 6, 9];
        const codeNumberOneToThree = [1, 2, 3];
        const codeNumberOne = [1];
        const PCP_PROGRAMACAO_PRODUCAO = 1;
        let components = {};
        let insert = ``;
        const array = [];
        if (!NUMERO_ODF || !NUMERO_OPERACAO || !CODIGO_MAQUINA) {
            apiResponse['message'] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        const groupOdf = await (0, query_1.select)(VW_APP_APTO_PROGRAMACAO_PRODUCAO, { NUMERO_ODF });
        if (!groupOdf) {
            apiResponse['message'] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const indexOdf = groupOdf.findIndex((item) => { return ('00' + String(item['NUMERO_OPERACAO']).replaceAll(' ', '0')) === NUMERO_OPERACAO; });
        const odf = groupOdf[indexOdf] || null;
        let { QTDE_LIB, QTD_BOAS, QTD_REFUGO, QTD_RETRABALHADA, QTD_FALTANTE, QTDE_APONTADA, QTDE_ODF, CODIGO_PECA, REVISAO } = odf;
        if (!odf) {
            apiResponse['message'] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        if (indexOdf <= 0) {
            odf['QTDE_LIB'] = QTDE_ODF - (QTD_BOAS || 0) + (QTD_REFUGO || 0) + (QTD_RETRABALHADA || 0) + (QTD_FALTANTE || 0);
            QTDE_LIB = odf['QTDE_LIB'];
        }
        else {
            odf['QTDE_LIB'] = (groupOdf[indexOdf - 1]['QTD_BOAS'] || 0) - (QTD_BOAS || 0) - (QTD_REFUGO || 0) - (QTD_RETRABALHADA || 0) - (QTD_FALTANTE || 0);
            QTDE_LIB = odf['QTDE_LIB'];
        }
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO }, allowedCodePointed);
        const { code } = hisaponta;
        try {
            await (0, cookieGenerator_1.cookieGenerator)(res, odf);
            if (QTDE_APONTADA === QTDE_ODF) {
                apiResponse['message'] = (0, message_1.message)("Pointed");
                return res.status(200).json(apiResponse);
            }
            else if (!QTDE_LIB || QTDE_LIB <= 0) {
                apiResponse['message'] = (0, message_1.message)("NoLimit");
                return res.status(200).json(apiResponse);
            }
            apiResponse['code'] = code;
            if (ESTOQUE_MOD === 'TRUE') {
                components = await (0, selectIfHasP_1.checkForComponents)({ NUMERO_ODF, NUMERO_OPERACAO, CODIGO_PECA, QTDE_LIB, FUNCIONARIO, });
                if (components.insertAddressUpdate) {
                    for (let i = 0; i < components.insertAddressUpdate.length; i++) {
                        array.push(components.insertAddressUpdate[i]);
                    }
                }
                if (components.message === (0, message_1.message)("NoLimit")) {
                    apiResponse['message'] = `Sem quantidade para apontamento : ${components['semLimite']}`;
                    return res.status(200).json(apiResponse);
                }
            }
            if (code === (0, message_1.message)("RipFin") || code === (0, message_1.message)("Return")) {
                apiResponse['code'] = (0, message_1.message)("SetupIni");
                if (FERRAMENTA_MOD === 'TRUE') {
                    insert = await (0, insert_1.istInto)(codeNumberOne, String(FUNCIONARIO), Number(NUMERO_ODF), CODIGO_PECA, REVISAO, NUMERO_OPERACAO.replaceAll(' ', '').replaceAll('000', ''), CODIGO_MAQUINA, Number(QTDE_LIB), null, null, ["INI SETUP"], new Date().getTime(), null, null, null);
                }
                else {
                    insert = await (0, insert_1.istInto)(codeNumberOneToThree, String(FUNCIONARIO), Number(NUMERO_ODF), CODIGO_PECA, REVISAO, NUMERO_OPERACAO.replaceAll(' ', ''), CODIGO_MAQUINA, Number(QTDE_LIB), null, null, ["INI SETUP", 'FIN SETUP', 'INI PROD'], new Date().getTime(), null, null, null);
                    apiResponse['code'] = (0, message_1.message)("ProdIni");
                }
            }
            odf['QTDE_LIB'] = !components['quantidade'] ? odf['QTDE_LIB'] : components['quantidade'];
            odf['condic'] = !components['condic'] ? "SEM CONDIC" : components['condic'];
            odf['childCode'] = !components['childCode'] ? [] : components['childCode'];
            odf['execut'] = !components['execut'] ? [] : components['execut'];
            const updateStr = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, { QTDE_LIB, NUMERO_ODF, NUMERO_OPERACAO, });
            array.push(updateStr);
            array.push(insert);
            await (0, cookieGenerator_1.cookieGenerator)(res, odf);
            await connection.query(array.join('')).then((result) => result.rowsAffected);
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            console.log('Erro em ODF', error);
            apiResponse['message'] = 'Erro na requisição';
            return res.json(apiResponse);
        }
    }
}
exports.default = Odf;
//# sourceMappingURL=point.js.map