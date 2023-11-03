"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const insertNewOrder_1 = require("./insertNewOrder");
const global_config_1 = require("../../global.config");
const mssql_1 = __importDefault(require("mssql"));
const verifyCodeNote_1 = require("./verifyCodeNote");
const insert_1 = require("./insert");
const message_1 = require("./message");
const query_1 = require("./query");
const update_1 = require("./update");
class PointService {
    async point(req, res) {
        const apiResponse = req.body || null;
        const strQuery = [];
        const lastProcessODF = "999";
        let { NUMERO_OPERACAO, CODIGO_PECA, CODIGO_MAQUINA, FUNCIONARIO, pointGoodFeed, pointMissingFeed, pointReworkFeed, pointBadFeed, NUMERO_ODF, RIP_MOD, EMPLOYEE_MOD, SUPERVISOR_MOD, EMAIL_MOD, REVISAO, ESTOQUE_MOD, childCode, execut, CODIGO_CLIENTE, supervisor, selectedMotive, } = apiResponse;
        NUMERO_OPERACAO = String(Number(NUMERO_OPERACAO));
        CODIGO_MAQUINA = String(CODIGO_MAQUINA.replaceAll(" ", ""));
        NUMERO_ODF = Number(NUMERO_ODF.replaceAll(" ", ""));
        if (typeof NUMERO_OPERACAO !== "string" ||
            typeof CODIGO_MAQUINA !== "string" ||
            typeof NUMERO_ODF !== "number" ||
            typeof supervisor !== "string") {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        pointGoodFeed = Number(pointGoodFeed);
        apiResponse["pointGoodFeed"] = pointGoodFeed;
        pointBadFeed = Number(pointBadFeed);
        apiResponse["pointBadFeed"] = pointBadFeed;
        pointMissingFeed = Number(pointMissingFeed);
        apiResponse["pointMissingFeed"] = pointMissingFeed;
        pointReworkFeed = Number(pointReworkFeed);
        apiResponse["pointReworkFeed"] = pointReworkFeed;
        if (typeof pointGoodFeed !== "number" ||
            typeof pointBadFeed !== "number" ||
            typeof pointReworkFeed !== "number" ||
            typeof pointMissingFeed !== "number") {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        if (pointGoodFeed === null ||
            pointGoodFeed === undefined ||
            pointGoodFeed === Infinity ||
            pointGoodFeed < 0 ||
            Number.isNaN(pointGoodFeed) ||
            pointBadFeed === null ||
            pointBadFeed === undefined ||
            pointBadFeed === Infinity ||
            pointBadFeed < 0 ||
            Number.isNaN(pointBadFeed) ||
            pointMissingFeed === null ||
            pointMissingFeed === undefined ||
            pointMissingFeed === Infinity ||
            pointMissingFeed < 0 ||
            Number.isNaN(pointMissingFeed) ||
            pointReworkFeed === null ||
            pointReworkFeed === undefined ||
            pointReworkFeed === Infinity ||
            pointReworkFeed < 0 ||
            Number.isNaN(pointReworkFeed)) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        if (typeof childCode !== "object") {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const codeNumberOne = 1;
        const codeNumberTwo = 2;
        const codeNumberThree = 3;
        const codeNumberFour = 4;
        const codeNumberFive = 5;
        const codeNumberSix = 6;
        const PCP_PROGRAMACAO_PRODUCAO = 3;
        const allowedCodePointed = [3];
        const totalValue = Number(pointGoodFeed + pointBadFeed + pointMissingFeed);
        if (!totalValue ||
            totalValue === Infinity ||
            totalValue <= 0 ||
            Number.isNaN(totalValue)) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({
            NUMERO_ODF,
            NUMERO_OPERACAO,
            CODIGO_MAQUINA,
        }, allowedCodePointed);
        const { code, accepted, employee, time } = hisaponta;
        apiResponse["code"] = code;
        if (!accepted || !employee) {
            apiResponse["message"] = (0, message_1.message)("Pointed");
            return res.status(200).json(apiResponse);
        }
        const viewOdfsGathered = 0;
        const groupOdf = (await (0, query_1.select)(viewOdfsGathered, { NUMERO_ODF }));
        if (!Array.isArray(groupOdf) || groupOdf.length === 0) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const indexOdf = groupOdf.findIndex((item) => {
            return (String(Number(item["NUMERO_OPERACAO"])) ===
                NUMERO_OPERACAO);
        });
        const odf = groupOdf[indexOdf];
        if (!odf || !Object.keys(odf).length) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        let { QTDE_LIB, QTDE_APONTADA, QTDE_ODF, QTD_FALTANTE, QTD_REFUGO, QTD_RETRABALHADA, QTD_BOAS, } = odf;
        QTDE_LIB = Number(QTDE_LIB);
        QTDE_ODF = Number(QTDE_ODF);
        QTD_REFUGO = Number(QTD_REFUGO);
        QTD_RETRABALHADA = Number(QTD_RETRABALHADA);
        QTD_FALTANTE = Number(QTD_FALTANTE);
        QTDE_APONTADA = Number(QTDE_APONTADA);
        QTD_BOAS = Number(QTD_BOAS);
        if (typeof QTD_BOAS !== "number" ||
            typeof QTDE_LIB !== "number" ||
            typeof QTDE_ODF !== "number" ||
            typeof QTD_REFUGO !== "number" ||
            typeof QTD_RETRABALHADA !== "number" ||
            typeof QTD_FALTANTE !== "number" ||
            typeof QTDE_APONTADA !== "number") {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        if (!QTDE_LIB ||
            QTDE_LIB === Infinity ||
            QTDE_LIB <= 0 ||
            Number.isNaN(QTDE_LIB) ||
            !QTDE_ODF ||
            QTDE_ODF === Infinity ||
            QTDE_ODF <= 0 ||
            Number.isNaN(QTDE_ODF) ||
            QTD_REFUGO === null ||
            QTD_REFUGO === undefined ||
            QTD_REFUGO === Infinity ||
            QTD_REFUGO < 0 ||
            Number.isNaN(QTD_REFUGO) ||
            QTD_RETRABALHADA === null ||
            QTD_RETRABALHADA === undefined ||
            QTD_RETRABALHADA === Infinity ||
            QTD_RETRABALHADA < 0 ||
            Number.isNaN(QTD_RETRABALHADA) ||
            QTD_FALTANTE === null ||
            QTD_FALTANTE === undefined ||
            QTD_FALTANTE === Infinity ||
            QTD_FALTANTE < 0 ||
            Number.isNaN(QTD_FALTANTE) ||
            QTDE_APONTADA === null ||
            QTDE_APONTADA === undefined ||
            QTDE_APONTADA === Infinity ||
            QTDE_APONTADA < 0 ||
            Number.isNaN(QTDE_APONTADA) ||
            QTD_BOAS === null ||
            QTD_BOAS === undefined ||
            QTD_BOAS === Infinity ||
            QTD_BOAS < 0 ||
            Number.isNaN(QTD_BOAS)) {
            apiResponse["message"] = "Quantidade apontada excede o limite";
            return res.status(200).json(apiResponse);
        }
        if (totalValue > QTDE_LIB) {
            apiResponse["message"] = "Quantidade apontada excede o limite";
            return res.status(200).json(apiResponse);
        }
        const leftInOdf = QTDE_LIB - totalValue;
        if (typeof leftInOdf !== "number") {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        if (leftInOdf < 0 || leftInOdf === Infinity || Number.isNaN(leftInOdf)) {
            apiResponse["message"] = "Quantidade apontada excede o limite";
            return res.status(200).json(apiResponse);
        }
        if (pointBadFeed > 0) {
            if (!selectedMotive || selectedMotive === '--Selecionar--') {
                apiResponse["message"] = "Motivo de refugo inválido";
                return res.status(200).json(apiResponse);
            }
        }
        const valorApontado = QTDE_APONTADA + totalValue;
        if (typeof valorApontado !== "number") {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        if (valorApontado < 0 ||
            valorApontado === Infinity ||
            Number.isNaN(valorApontado)) {
            apiResponse["message"] = "Quantidade apontada excede o limite";
            return res.status(200).json(apiResponse);
        }
        if (valorApontado > QTDE_ODF) {
            apiResponse["message"] = "Quantidade apontada excede o limite";
            return res.status(200).json(apiResponse);
        }
        if (NUMERO_OPERACAO === lastProcessODF) {
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            const address = await connection
                .query(`
                    SELECT QUANTIDADE FROM CST_ESTOQUE_ENDERECOS WHERE 1 = 1 AND ODF = '${NUMERO_ODF}'
                `)
                .then((result) => result["recordset"]);
            if ((!address || address["length"] <= 0) && pointGoodFeed > 0) {
                apiResponse["message"] = "Erro ao localizar endereço";
                return res.status(200).json(apiResponse);
            }
            let sumInAdd = 0;
            for (let i = 0; i < address["length"]; i++) {
                const eachValue = Number(address[i].QUANTIDADE);
                sumInAdd += eachValue;
            }
            if (typeof sumInAdd !== "number") {
                apiResponse["message"] = "Erro com o valor inserido no endereço";
                return res.status(200).json(apiResponse);
            }
            if (sumInAdd === null ||
                sumInAdd === undefined ||
                sumInAdd === Infinity ||
                sumInAdd < 0 ||
                Number.isNaN(sumInAdd)) {
                apiResponse["message"] = "Erro com o valor inserido no endereço";
                return res.status(200).json(apiResponse);
            }
            if (QTD_BOAS + pointGoodFeed !== sumInAdd) {
                apiResponse["message"] = "Total apontado difere do valor endereçado";
                return res.status(200).json(apiResponse);
            }
            if (pointGoodFeed > 0) {
                strQuery.push(`INSERT INTO HISTORICO_ESTOQUE_POINT (DATAHORA, STATUS, ODF, CODIGO_PECA, QUANTIDADE, USUARIO) VALUES(GETDATE(), 'ENTRADA', '${NUMERO_ODF}', '${CODIGO_PECA}', ${pointGoodFeed}, '${FUNCIONARIO}');`);
            }
            const cstRetrabalhoOdf = await connection
                .query(`SELECT STATUS FROM CST_RETRABALHO_ODF WHERE 1 = 1 AND ODF_ORIGEM = '${NUMERO_ODF}'`)
                .then((result) => result["recordset"]);
            if (cstRetrabalhoOdf['length'] > 0) {
                for (let i = 0; i < cstRetrabalhoOdf['length']; i++) {
                    const stats = cstRetrabalhoOdf[i]['STATUS'].toUpperCase();
                    if (stats === 'ABERTO') {
                        apiResponse["message"] = "Odf de retrabalho não finalizada";
                        return res.status(200).json(apiResponse);
                    }
                }
            }
        }
        if (SUPERVISOR_MOD === "TRUE") {
            const moment = new Date();
            const { HORA_FIM, DT_FIM_OP } = odf;
            odf["EXECUT"] = 0;
            if (!DT_FIM_OP || !HORA_FIM) {
            }
            else {
                const year = parseInt(DT_FIM_OP.substr(0, 4));
                const month = parseInt(DT_FIM_OP.substr(4, 2)) - 1;
                const day = parseInt(DT_FIM_OP.substr(6, 2));
                const prodFinalDate = new Date(Date.UTC(year, month, day, HORA_FIM.getUTCHours(), HORA_FIM.getUTCMinutes(), HORA_FIM.getUTCSeconds(), HORA_FIM.getUTCMilliseconds()));
                if (moment < prodFinalDate) {
                    const timeToPoint = 30000;
                    const timeSpendForEntireProd = Number(odf["EXECUT"] * QTDE_LIB * 1000);
                    const timeThatShouldTook = new Date(time.getTime() + timeSpendForEntireProd + timeToPoint);
                    if (timeThatShouldTook < moment) {
                        odf["EXECUT"] = timeToPoint + (timeThatShouldTook.getTime() - moment.getTime());
                    }
                }
            }
            if ((pointBadFeed > 0 || pointMissingFeed > 0 || pointReworkFeed > 0 || leftInOdf > 0 || odf['EXECUT'] <= 0) && !supervisor) {
                apiResponse["message"] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            if ((pointBadFeed > 0 || pointMissingFeed > 0 || pointReworkFeed > 0 || leftInOdf > 0 || odf['EXECUT'] <= 0) && supervisor) {
                if (supervisor === '0' || supervisor === "00" || supervisor === '000' || supervisor === "0000" || supervisor === '00000' || supervisor === "000000" || supervisor === '0000000' || supervisor === '00000000') {
                    apiResponse["message"] = (0, message_1.message)("Nobadge");
                    return res.status(200).json(apiResponse);
                }
                const supervisorVw = 10;
                const findSupervisor = await (0, query_1.select)(supervisorVw, { supervisor });
                if (!findSupervisor || findSupervisor.length === 0) {
                    apiResponse["message"] = "Crachá não encontrado";
                    return res.status(200).json(apiResponse);
                }
            }
        }
        if (EMAIL_MOD === "TRUE") {
            if (pointReworkFeed > 0 || pointMissingFeed > 0) {
                const resultToInsert = await (0, insertNewOrder_1.insertIntoNewOrder)(0, NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_ODF, leftInOdf, totalValue, pointBadFeed, pointGoodFeed, pointReworkFeed, pointMissingFeed, CODIGO_PECA, CODIGO_CLIENTE, FUNCIONARIO, REVISAO);
                strQuery.push(resultToInsert);
            }
        }
        if (ESTOQUE_MOD === "TRUE") {
            if (typeof childCode === "object") {
                if (childCode && childCode.length > 0) {
                    const ALOCACAO_POINT = 22;
                    const resoureOfAlocated = await (0, query_1.select)(ALOCACAO_POINT, { NUMERO_ODF, NUMERO_OPERACAO });
                    if (resoureOfAlocated["length"] <= 0 ||
                        childCode.length !== resoureOfAlocated["length"]) {
                        apiResponse["message"] = "Erro ao identificar peças filhas";
                        return res.status(200).json(apiResponse);
                    }
                    const reservado = [];
                    for (let i = 0; i < Object.entries(resoureOfAlocated).length; i++) {
                        const part = resoureOfAlocated[i]["NUMITE"];
                        const reser = resoureOfAlocated[i]["RESERVADO"];
                        if (part !== childCode[i]) {
                            apiResponse["message"] = "Erro ao identificar peças filhas";
                            return res.status(200).json(apiResponse);
                        }
                        reservado.push(reser);
                    }
                    const min = Math.min(...reservado);
                    if (totalValue > min || min <= 0) {
                        apiResponse["message"] = "Apontado maior que a reserva";
                        return res.status(200).json(apiResponse);
                    }
                    for (let i = 0; i < childCode.length; i++) {
                        if (leftInOdf > 0) {
                            strQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${Number(execut[i]) * QTDE_LIB - totalValue * Number(execut[i])} WHERE 1 = 1 AND CODIGO = '${String(childCode[i])}'`);
                            strQuery.push(`INSERT INTO HISTORICO_ESTOQUE_POINT (DATAHORA, STATUS, ODF, CODIGO_PECA, QUANTIDADE, USUARIO) VALUES(GETDATE(), 'ENTRADA', '${NUMERO_ODF}', '${childCode[i]}', ${Number(execut[i]) * QTDE_LIB - totalValue * Number(execut[i])}, '${FUNCIONARIO}')`);
                        }
                        strQuery.push(`DELETE ALOCACAO_POINT WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' AND CODIGO_FILHO = '${String(childCode[i])}'`);
                    }
                }
            }
        }
        let insert;
        async function insertodf(arrayOfPointCode, arrayOfPointFields, employeeAfter) {
            insert = await (0, insert_1.insertInto)(arrayOfPointCode, employeeAfter, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, pointGoodFeed, pointBadFeed, arrayOfPointFields, apiResponse["tempoDecorrido"], apiResponse["selectedMotive"] || null, pointMissingFeed, pointReworkFeed);
        }
        if (RIP_MOD === "TRUE") {
            if (EMPLOYEE_MOD === "TRUE") {
                if (FUNCIONARIO !== employee) {
                    await insertodf([codeNumberFour, codeNumberFive, codeNumberSix], ["FIN PROD", "INI RIP", "FIN RIP"], employee);
                    await insertodf([codeNumberOne, codeNumberTwo, codeNumberThree, codeNumberFour, codeNumberFive,], ["INI SETUP", "FIN SETUP", "INI PROD", "FIN PROD", "INI RIP"], FUNCIONARIO);
                }
                else {
                    await insertodf([codeNumberFour, codeNumberFive], ["FIN PROD", "INI RIP"], FUNCIONARIO);
                }
            }
            else {
                await insertodf([codeNumberFour, codeNumberFive], ["FIN PROD", "INI RIP"], FUNCIONARIO);
            }
            apiResponse["code"] = (0, message_1.message)("RipIni");
        }
        else {
            if (EMPLOYEE_MOD === "TRUE") {
                if (FUNCIONARIO !== employee) {
                    await insertodf([codeNumberFour, codeNumberFive, codeNumberSix], ["FIN PROD", "INI RIP", "FIN RIP"], employee);
                    await insertodf([codeNumberOne, codeNumberTwo, codeNumberThree, codeNumberFour, codeNumberFive, codeNumberSix,
                    ], ["INI SETUP", "FIN SETUP", "INI PROD", "FIN PROD", "INI RIP", "FIN RIP"], FUNCIONARIO);
                }
                else {
                    await insertodf([codeNumberFour, codeNumberFive, codeNumberSix], ["FIN PROD", "INI RIP", "FIN RIP"], FUNCIONARIO);
                }
            }
            else {
                await insertodf([codeNumberFour, codeNumberFive, codeNumberSix], ["FIN PROD", "INI RIP", "FIN RIP"], FUNCIONARIO);
            }
            apiResponse["code"] = (0, message_1.message)("RipFin");
            const PCP_PROGRAMACAO_PRODUCAO = 0;
            const finalTimer = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, {
                NUMERO_ODF,
                NUMERO_OPERACAO,
                CODIGO_MAQUINA,
            });
            strQuery.push(finalTimer);
        }
        if ((pointBadFeed > 0 || pointMissingFeed > 0 && indexOdf < groupOdf.length)) {
            const newOperNumber = groupOdf[indexOdf + 1]['NUMERO_OPERACAO'];
            const newQtdOdf = Number(groupOdf[indexOdf]['QTDE_ODF']) - QTD_REFUGO - QTD_FALTANTE - pointBadFeed - pointMissingFeed;
            const str = `UPDATE PCP_PROGRAMACAO_PRODUCAO SET QTDE_ODF = ${newQtdOdf} WHERE 1 = 1 AND NUMERO_ODF = '${NUMERO_ODF}' AND NUMERO_OPERACAO = '${newOperNumber}'`;
            strQuery.push(str);
        }
        try {
            let updatePcpStr = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, {
                valorApontado,
                released: QTDE_LIB,
                pointBadFeed,
                pointGoodFeed,
                pointReworkFeed,
                pointMissingFeed,
                NUMERO_ODF,
                NUMERO_OPERACAO,
                CODIGO_MAQUINA,
            });
            if (indexOdf > 0) {
                if (NUMERO_OPERACAO) {
                    strQuery.push(await (0, update_1.update)(7, {
                        pointGoodFeed,
                        NUMERO_ODF,
                        NUMERO_OPERACAO,
                    }));
                }
            }
            if (indexOdf < groupOdf.length) {
                if (groupOdf[indexOdf + 1]) {
                    const NUMERO_OPERACAO = groupOdf[indexOdf + 1]['NUMERO_OPERACAO'];
                    if (NUMERO_OPERACAO) {
                        strQuery.push(await (0, update_1.update)(6, {
                            pointGoodFeed,
                            NUMERO_ODF,
                            NUMERO_OPERACAO,
                        }));
                    }
                }
            }
            strQuery.push(updatePcpStr);
            strQuery.push(insert);
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            await connection
                .query(strQuery.join("\n").replaceAll(",INSERT", " INSERT"))
                .then((result) => result.rowsAffected);
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            apiResponse["message"] = "Tempo excedido";
            console.log("Timeout linha 210:", error);
            return res.status(200).json(apiResponse);
        }
    }
}
exports.default = PointService;
//# sourceMappingURL=point.js.map