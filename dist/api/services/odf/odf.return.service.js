"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unravelBarcode_1 = require("../../utils/unravelBarcode");
const verifyCodeNote_1 = require("../../utils/verifyCodeNote");
const global_config_1 = require("../../../global.config");
const insert_1 = require("../../utils/insert");
const message_1 = require("../../utils/message");
const update_1 = require("../../utils/update");
const query_1 = require("../../utils/query");
const mssql_1 = __importDefault(require("mssql"));
class OdfServiceReturn {
    async returnPoint(req, res) {
        const codeNumberEight = [8];
        const regExPattern = /^0+$/;
        const apiResponse = req.body;
        let { DEVOLUCAO_MOD, SUPERVISOR_MOD, ESTOQUE_MOD, supervisor, quantity, barcode, FUNCIONARIO, valueStorage, goodFeed, badFeed, motives } = apiResponse;
        const allowedCodePointed = [6];
        const viewOdfsGathered = 0;
        let strQuery = [];
        const PCP_PROGRAMACAO_PRODUCAO = 2;
        let checkForValues = [];
        const lastProcessOdf = 999;
        if (DEVOLUCAO_MOD === "FALSE") {
            apiResponse["message"] = (0, message_1.message)("NoModule");
            return res.status(200).json(apiResponse);
        }
        if (!barcode || regExPattern.test(barcode) || typeof barcode !== 'string') {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        if (!quantity || typeof quantity !== 'string') {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        quantity = Number(quantity);
        if (!valueStorage || typeof valueStorage !== 'string') {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        if (!motives || typeof motives !== 'string' || motives === '--Selecionar--') {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        if (!FUNCIONARIO || typeof FUNCIONARIO !== 'string') {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const unraveledBarcode = await (0, unravelBarcode_1.unravelBarcode)({ barcode });
        if (!unraveledBarcode) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        let { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA } = unraveledBarcode;
        if (!NUMERO_ODF ||
            !NUMERO_OPERACAO ||
            !CODIGO_MAQUINA) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        NUMERO_OPERACAO = Number(NUMERO_OPERACAO);
        const { code, accepted } = await (0, verifyCodeNote_1.codePoint)({
            NUMERO_ODF,
            NUMERO_OPERACAO,
            FUNCIONARIO,
        }, allowedCodePointed);
        apiResponse["code"] = code;
        if (!accepted) {
            apiResponse["message"] = "ODF não pode ser estornada";
            return res.status(200).json(apiResponse);
        }
        if (!quantity || Number.isNaN(Number(quantity) || quantity === Infinity)) {
            apiResponse["message"] = "Quantidade de estorno inválida";
            return res.status(200).json(apiResponse);
        }
        const groupOdf = await (0, query_1.select)(viewOdfsGathered, { NUMERO_ODF });
        if (!groupOdf || groupOdf.length <= 0) {
            apiResponse["message"] = "ODF não pode ser estornada";
            return res.status(200).json(apiResponse);
        }
        const index = groupOdf.findIndex((item) => {
            return (Number(item["NUMERO_OPERACAO"]) ===
                Number(NUMERO_OPERACAO));
        });
        const odf = groupOdf[index];
        if (!odf || !Object.keys(odf).length) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        let { QTDE_LIB, QTD_BOAS, QTD_FALTANTE, QTDE_APONTADA, QTDE_ODF, QTD_REFUGO, QTD_RETRABALHADA, CODIGO_PECA } = odf;
        QTDE_APONTADA = Number(QTDE_APONTADA);
        if (typeof QTDE_APONTADA !== 'number' || QTDE_APONTADA === Infinity || Number.isNaN(QTDE_APONTADA)) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        let pointedValues = null;
        for (let i = 0; i < groupOdf.length; i++) {
            if (groupOdf.length - 1 !== i) {
                pointedValues = Math.min(groupOdf[i]["QTDE_APONTADA"], groupOdf[i + 1]["QTDE_APONTADA"]);
            }
            else {
                pointedValues = Math.min(groupOdf[i]["QTDE_APONTADA"], groupOdf[i - 1]["QTDE_APONTADA"]);
            }
        }
        for (let z = 0; z < groupOdf.length; z++) {
            checkForValues.push(groupOdf[z].QTDE_APONTADA === pointedValues ? true : false);
        }
        let lastPointIndex = checkForValues.lastIndexOf(true);
        if (lastPointIndex !== index) {
            apiResponse["message"] = (0, message_1.message)("NoDevo");
            return res.status(200).json(apiResponse);
        }
        if (Number(QTDE_APONTADA) < Number((goodFeed || 0) + (badFeed || 0)) || Number(QTDE_APONTADA) <= 0 || (!QTD_REFUGO && (badFeed || 0) > 0)) {
            apiResponse["message"] = (0, message_1.message)("NoLimit");
            return res.json(apiResponse);
        }
        else if (Number(odf["NUMERO_OPERACAO"]) !== Number(NUMERO_OPERACAO)) {
            apiResponse["message"] = "ODF não pode ser estornada";
            return res.status(200).json(apiResponse);
        }
        else if (CODIGO_MAQUINA !== odf['CODIGO_MAQUINA']) {
            apiResponse["message"] = "ODF não pode ser estornada";
            return res.status(200).json(apiResponse);
        }
        if (index == 0) {
            QTDE_LIB = QTDE_ODF - QTDE_APONTADA - QTD_FALTANTE;
        }
        else {
            QTDE_LIB =
                (QTD_BOAS || 0) -
                    (QTD_REFUGO || 0) -
                    (QTD_FALTANTE || 0);
        }
        if (QTDE_LIB === Infinity || Number.isNaN(QTDE_LIB) || QTDE_LIB === null || QTDE_LIB === undefined) {
            apiResponse["message"] = "ODF não pode ser estornada";
            return res.status(200).json(apiResponse);
        }
        if (SUPERVISOR_MOD === "TRUE") {
            if (!supervisor || regExPattern.test(supervisor)) {
                apiResponse["message"] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            const resultSupervisor = await (0, query_1.select)('tableOfSupervisors', { supervisor });
            if (!resultSupervisor) {
                apiResponse["message"] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
        }
        if (valueStorage !== 'BOAS' && valueStorage !== "RUINS") {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        valueStorage === "BOAS" ? apiResponse["pointGoodFeed"] = quantity : apiResponse["pointBadFeed"] = quantity;
        const { pointBadFeed, pointGoodFeed } = apiResponse;
        if (pointBadFeed && valueStorage === 'RUINS' && (!QTD_REFUGO || QTD_REFUGO <= 0)) {
            apiResponse["message"] = "Quantidade de estorno inválida";
            return res.status(200).json(apiResponse);
        }
        else if (pointGoodFeed && valueStorage === 'BOAS' && (!QTD_BOAS || QTD_BOAS <= 0)) {
            apiResponse["message"] = "Quantidade de estorno inválida";
            return res.status(200).json(apiResponse);
        }
        if ((!pointBadFeed && !pointGoodFeed) || pointBadFeed === Infinity || pointGoodFeed === Infinity || Number.isNaN(pointBadFeed) || Number.isNaN(pointGoodFeed)) {
            apiResponse["message"] = "Quantidade de estorno inválida";
            return res.status(200).json(apiResponse);
        }
        if ((pointGoodFeed && valueStorage === 'BOAS') && quantity > QTD_BOAS) {
            apiResponse["message"] = "Quantidade de estorno inválida";
            return res.status(200).json(apiResponse);
        }
        if ((pointBadFeed && valueStorage === 'RUINS') && quantity > QTD_REFUGO) {
            apiResponse["message"] = "Quantidade de estorno inválida";
            return res.status(200).json(apiResponse);
        }
        const newValorApontado = Number(QTD_BOAS) +
            Number(QTD_REFUGO) +
            Number(QTD_FALTANTE) +
            Number(QTD_RETRABALHADA) -
            quantity;
        if (ESTOQUE_MOD === "TRUE") {
            const resource = (await (0, query_1.select)("queryToCheckForAlocatedParts", {
                NUMERO_ODF,
                NUMERO_OPERACAO,
            }));
            if (resource) {
                const execut = resource.map((element) => element["EXECUT"]);
                const childCode = resource.map((item) => item["NUMITE"]);
                const processInOdf = resource
                    .map((item) => item["NUMSEQ"])
                    .filter((element) => element ===
                    String(NUMERO_OPERACAO));
                if (processInOdf.length > 0) {
                    for (let i = 0; i < childCode.length; i++) {
                        strQuery.push(`UPDATE ${process.env['MS_TABLE_CONTAINER_OF_PARTS_STORAGE']} SET SALDOREAL = SALDOREAL + ${quantity * Number(execut[i])} WHERE 1 = 1 AND CODIGO = '${childCode[i]}'`);
                    }
                }
            }
            if (pointGoodFeed && QTD_BOAS) {
                if (NUMERO_OPERACAO === lastProcessOdf) {
                    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
                    const vwAddressStorage = await connection.query(`SELECT * FROM ${process.env['MS_TABLE_CONTAINER_STORAGE_IN_ADDRESS']} WHERE 1 = 1 AND COD_PRODUTO  = '${CODIGO_PECA}'`).then((result) => result['recordset']);
                    if (vwAddressStorage['length'] <= 0) {
                        await connection.close();
                        apiResponse['message'] = 'Não é possivel ver o endereço';
                        return res.status(200).json(apiResponse);
                    }
                    for (let w = 0; w < vwAddressStorage['length']; w++) {
                        if (quantity <= 0)
                            break;
                        quantity = quantity -= vwAddressStorage[w].QUANTIDADE;
                        vwAddressStorage[w].QUANTIDADE = quantity > 0 ? 0 : -(quantity);
                    }
                    const str = [];
                    for (let z = 0; z < vwAddressStorage["length"]; z++) {
                        const address = vwAddressStorage[z].ENDERECO;
                        const value = vwAddressStorage[z].QUANTIDADE;
                        if (value == 0) {
                            str.push(`UPDATE ${process.env["MS_TABLE_OF_ADDRESS"]} SET CODIGO = NULL, ODF = NULL, QUANTIDADE = NULL WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' AND ENDERECO = '${address}';`);
                        }
                        else {
                            str.push(`UPDATE ${process.env["MS_TABLE_OF_ADDRESS"]} SET QUANTIDADE = ${value} WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' AND ENDERECO = '${address}';`);
                        }
                    }
                    strQuery.push(str.join(''));
                }
            }
        }
        const insertEight = await (0, insert_1.insertInto)(codeNumberEight, FUNCIONARIO, NUMERO_ODF, String(odf["CODIGO_PECA"]), String(odf["REVISAO"]), String(NUMERO_OPERACAO), CODIGO_MAQUINA, Number(QTDE_LIB), Number(pointGoodFeed || 0), Number(pointBadFeed || 0), ["ESTORNO"], 0, null, 0, 0);
        strQuery.push(insertEight);
        const updatedStr = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, {
            CODIGO_PECA: String(odf["CODIGO_PECA"]),
            valorApontado: newValorApontado,
            pointGoodFeed,
            missingFeed: 0,
            QTDE_LIB,
            pointBadFeed,
            valorTotal: quantity,
            NUMERO_ODF,
            NUMERO_OPERACAO,
            CODIGO_MAQUINA,
        });
        strQuery.push(updatedStr);
        strQuery = strQuery.join("\n");
        try {
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            const resultFromUp = await connection
                .query(strQuery)
                .then((result) => result.rowsAffected);
            if (resultFromUp["length"] > 0) {
                const indexOfMin = Math.min(...resultFromUp);
                if (!indexOfMin || indexOfMin < 0) {
                    apiResponse["message"] = "Erro ao estornar";
                }
                else {
                    apiResponse["message"] = "Estornado";
                }
            }
            else {
                apiResponse["message"] = "Erro ao estornar";
            }
            await connection.close();
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            console.log("Error on insertEight", error);
            return res.status(200).json(apiResponse);
        }
    }
}
exports.default = OdfServiceReturn;
//# sourceMappingURL=odf.return.service.js.map