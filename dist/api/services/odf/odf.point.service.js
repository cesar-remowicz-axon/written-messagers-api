"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const insertNewOrder_1 = require("../../utils/insertNewOrder");
const verifyCodeNote_1 = require("../../utils/verifyCodeNote");
const global_config_1 = require("../../../global.config");
const insert_1 = require("../../utils/insert");
const message_1 = require("../../utils/message");
const query_1 = require("../../utils/query");
const update_1 = require("../../utils/update");
const mssql_1 = __importDefault(require("mssql"));
class OdfServiceToPoint {
    async point(req, res) {
        const apiResponse = req.body || null;
        const strQuery = [];
        const lastProcessODF = "999";
        const codeNumberOne = 1;
        const codeNumberTwo = 2;
        const codeNumberThree = 3;
        const codeNumberFour = 4;
        const codeNumberFive = 5;
        const codeNumberSix = 6;
        const VWContainerOfOdf = 3;
        const allowedCodePointed = [3];
        const viewOdfsGathered = 0;
        let insert = '';
        const regExPattern = /^0+$/;
        const mode = process.env['MODE'];
        let { NUMERO_OPERACAO, CODIGO_PECA, CODIGO_MAQUINA, FUNCIONARIO, pointGoodFeed, pointMissingFeed, pointReworkFeed, pointBadFeed, NUMERO_ODF, RIP_MOD, EMPLOYEE_MOD, SUPERVISOR_MOD, EMAIL_MOD, REVISAO, ESTOQUE_MOD, childCode, execut, CODIGO_CLIENTE, supervisor, selectedMotive, } = apiResponse;
        NUMERO_OPERACAO = String(Number(NUMERO_OPERACAO));
        CODIGO_MAQUINA = String(CODIGO_MAQUINA.replaceAll(" ", ""));
        NUMERO_ODF = Number(NUMERO_ODF.replaceAll(" ", ""));
        if (typeof NUMERO_OPERACAO !== "string" ||
            typeof CODIGO_MAQUINA !== "string" ||
            typeof NUMERO_ODF !== "number" ||
            typeof supervisor !== "string" ||
            typeof FUNCIONARIO !== 'string') {
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
        const totalValue = Number(pointGoodFeed + pointBadFeed + pointMissingFeed + pointReworkFeed);
        if (!totalValue ||
            totalValue === Infinity ||
            totalValue <= 0 ||
            Number.isNaN(totalValue)) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({
            NUMERO_ODF: String(NUMERO_ODF),
            NUMERO_OPERACAO,
            FUNCIONARIO,
        }, allowedCodePointed);
        const { code, accepted, employee, time } = hisaponta;
        apiResponse["code"] = code;
        if (!accepted || !employee) {
            apiResponse["message"] = (0, message_1.message)("Pointed");
            return res.status(200).json(apiResponse);
        }
        const groupOdf = (await (0, query_1.select)(viewOdfsGathered, { NUMERO_ODF }));
        if (!Array.isArray(groupOdf) || groupOdf.length <= 0) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const indexOdf = groupOdf.findIndex((item) => {
            return (String(Number(item[`${process.env['MS_COLUMN_OF_FOR_ODF_OPERATION_NUMBER_CONDITION']}`])) ===
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
        if (mode !== 'Demo') {
            if (pointGoodFeed) {
                const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
                if (NUMERO_OPERACAO === lastProcessODF && !CODIGO_PECA.includes("RE.")) {
                    const address = await connection
                        .query(` SELECT ${process.env['MS_COLUMN_OF_ADDRESS_QUANTITY']} FROM ${process.env['MS_TABLE_OF_ADDRESS']} WHERE 1 = 1 AND ${process.env['MS_COLUMN_OF_FOR_ODF_CONDITION']} = '${NUMERO_ODF}' `)
                        .then((result) => result["recordset"]);
                    if ((!address || address["length"] <= 0) && pointGoodFeed > 0) {
                        await connection.close();
                        apiResponse["message"] = "Erro ao localizar endereço";
                        return res.status(200).json(apiResponse);
                    }
                    let sumInAdd = 0;
                    for (let i = 0; i < address["length"]; i++) {
                        const eachValue = Number(address[i].QUANTIDADE);
                        sumInAdd += eachValue;
                    }
                    if (typeof sumInAdd !== "number") {
                        await connection.close();
                        apiResponse["message"] = "Erro com o valor inserido no endereço";
                        return res.status(200).json(apiResponse);
                    }
                    if (sumInAdd === null ||
                        sumInAdd === undefined ||
                        sumInAdd === Infinity ||
                        sumInAdd < 0 ||
                        Number.isNaN(sumInAdd)) {
                        await connection.close();
                        apiResponse["message"] = "Erro com o valor inserido no endereço";
                        return res.status(200).json(apiResponse);
                    }
                    if (QTD_BOAS + pointGoodFeed !== sumInAdd) {
                        await connection.close();
                        apiResponse["message"] = "Total apontado difere do valor endereçado";
                        return res.status(200).json(apiResponse);
                    }
                    if (pointGoodFeed > 0) {
                        strQuery.push(`INSERT INTO ${process.env['MS_TABLE_STORAGE_POINTED_HISTORIC']} (${process.env['ROWS_TO_INSERT_ON_STORAGE_POINTED_HISTORIC']}) VALUES(GETDATE(), '${process.env['ROW_OF_STATUS_IN_STORAGE_POINTED_HISTORIC']}', '${NUMERO_ODF}', '${CODIGO_PECA}', ${pointGoodFeed}, '${FUNCIONARIO}');`);
                    }
                }
                if (NUMERO_OPERACAO === lastProcessODF) {
                    const cstRetrabalhoOdf = await connection
                        .query(`SELECT ${process.env['COLUMN_OF_CONTAINER_OF_REWORK_ODF']} FROM ${process.env['MS_TABLE_CONTAINER_OF_REWORK_ODFS']} WHERE 1 = 1 AND ${process.env['COLUMN_OF_CONTAINER_OF_REWORK_ODF']} = '${NUMERO_ODF}'`)
                        .then((result) => result["recordset"]);
                    if (cstRetrabalhoOdf['length'] > 0) {
                        for (let i = 0; i < cstRetrabalhoOdf['length']; i++) {
                            const stats = cstRetrabalhoOdf[i]['STATUS'].toUpperCase();
                            if (stats === 'ABERTO') {
                                await connection.close();
                                apiResponse["message"] = "Odf de retrabalho não finalizada";
                                return res.status(200).json(apiResponse);
                            }
                        }
                    }
                }
                await connection.close();
            }
        }
        if (SUPERVISOR_MOD === "TRUE") {
            if (CODIGO_MAQUINA !== 'QUA001' && CODIGO_MAQUINA !== 'QUA002') {
                const moment = new Date();
                const { HORA_FIM, DT_FIM_OP } = odf;
                if (NUMERO_OPERACAO !== lastProcessODF) {
                    if (!DT_FIM_OP || !HORA_FIM) {
                        odf["EXECUT"] = 0;
                    }
                    else {
                        const year = parseInt(DT_FIM_OP.substr(0, 4));
                        const month = parseInt(DT_FIM_OP.substr(4, 2)) - 1;
                        const day = parseInt(DT_FIM_OP.substr(6, 2));
                        const prodFinalDate = new Date(Date.UTC(year, month, day, HORA_FIM.getUTCHours(), HORA_FIM.getUTCMinutes(), HORA_FIM.getUTCSeconds(), HORA_FIM.getUTCMilliseconds()));
                        if (moment < prodFinalDate) {
                            const timeSpendForEntireProd = Number(odf["EXECUT"] * QTDE_LIB * 1000);
                            const timeToPoint = 120000 + timeSpendForEntireProd * 0.01;
                            const timeThatShouldTook = new Date(time.getTime() + timeSpendForEntireProd + timeToPoint);
                            if (timeThatShouldTook < moment) {
                                odf["EXECUT"] = timeToPoint + (timeThatShouldTook.getTime() - moment.getTime());
                            }
                        }
                    }
                    if (supervisor !== '004067') {
                        if ((pointBadFeed > 0 || pointMissingFeed > 0 || pointReworkFeed > 0 || leftInOdf > 0 || odf['EXECUT'] <= 0) && !supervisor) {
                            apiResponse["message"] = (0, message_1.message)("Nobadge");
                            return res.status(200).json(apiResponse);
                        }
                        if ((pointBadFeed > 0 || pointMissingFeed > 0 || pointReworkFeed > 0 || leftInOdf > 0 || odf['EXECUT'] <= 0) && supervisor) {
                            if (regExPattern.test(supervisor)) {
                                apiResponse["message"] = (0, message_1.message)("Nobadge");
                                return res.status(200).json(apiResponse);
                            }
                            const findSupervisor = await (0, query_1.select)("tableOfSupervisorSpecificMachine", { supervisor, machine: CODIGO_MAQUINA });
                            if (!findSupervisor || findSupervisor.length === 0) {
                                apiResponse["message"] = "Crachá não encontrado";
                                return res.status(200).json(apiResponse);
                            }
                        }
                    }
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
            if (childCode) {
                if (childCode.length > 0) {
                    const resoureOfAlocated = await (0, query_1.select)("queryToCheckForAlocatedParts", { NUMERO_ODF, NUMERO_OPERACAO });
                    const addressForChildrenParts = await (0, query_1.select)('getAddressForChildrenParts', { parts: childCode.map((element) => element = `'${String(element)}'`).join(',') });
                    const arrayNotin = [];
                    const newAddress = [];
                    if (!addressForChildrenParts || addressForChildrenParts.length < childCode.length) {
                        for (let m = 0; m < childCode.length; m++) {
                            if (!addressForChildrenParts[m]) {
                                let dimensionsFatherComponents = await (0, query_1.select)(3, { CODIGO_PECA: childCode[m].peca, REVISAO });
                                const sizes = {
                                    comprimento: 0,
                                    largura: 0,
                                    peso: 0,
                                };
                                if (dimensionsFatherComponents[0]) {
                                    sizes.comprimento = dimensionsFatherComponents[0] ? dimensionsFatherComponents[0].COMPRIMENTO : 0;
                                    sizes.largura = dimensionsFatherComponents[0] ? dimensionsFatherComponents[0].LARGURA : 0;
                                    sizes.peso = dimensionsFatherComponents[0] ? dimensionsFatherComponents[0].EXECUT : 0;
                                }
                                let percen = '5';
                                const expedition = 'EX002';
                                if (CODIGO_MAQUINA === expedition) {
                                    percen = '7';
                                }
                                const conne = await mssql_1.default.connect(global_config_1.sqlConfig);
                                const addressAvailable = await conne.query(`SELECT DISTINCT TOP 1
                                                                                    ENDERECO,
                                                                                    CODIGO
                                                                                    FROM ${process.env['MS_TABLE_CONTAINER_STORAGE_IN_ADDRESS']} 
                                                                                    WHERE 1 = 1 
                                                                                    AND COD_PRODUTO IS NULL
                                                                                    AND ENDERECO LIKE '${percen}%' 
                                                                                    AND ENDERECO NOT LIKE '${percen}Z%' 
                                                                                    AND ENDERECO NOT LIKE '%QUA%'
                                                                                    AND ENDERECO NOT LIKE '%X%' 
                                                                                    AND ENDERECO NOT LIKE '%EX%'
                                                                                    AND COMPRIMENTO > ${sizes.comprimento} 
                                                                                    AND LARGURA > ${sizes.largura} 
                                                                                    AND PESO > ${sizes.peso}
                                                                                    AND CODIGO NOT IN (${arrayNotin.length <= 0 ? '0000' : arrayNotin.join(',')});`).then((result) => result['recordset']);
                                arrayNotin.push(!addressAvailable[0] ? '0000' : addressAvailable[0].CODIGO);
                                newAddress.push(addressAvailable[0]?.ENDERECO);
                            }
                        }
                    }
                    if (resoureOfAlocated["length"] <= 0 ||
                        childCode.length !== resoureOfAlocated["length"]) {
                        apiResponse["message"] = "Erro ao identificar peças filhas";
                        return res.status(200).json(apiResponse);
                    }
                    const reserved = [];
                    for (let i = 0; i < Object.entries(resoureOfAlocated).length; i++) {
                        const part = resoureOfAlocated[i]["NUMITE"];
                        const reser = resoureOfAlocated[i]["RESERVADO"];
                        if (part !== childCode[i]) {
                            apiResponse["message"] = "Erro ao identificar peças filhas";
                            return res.status(200).json(apiResponse);
                        }
                        reserved.push(reser);
                    }
                    const min = Math.min(...reserved);
                    if (totalValue > min || min <= 0) {
                        apiResponse["message"] = "Apontado maior que a reserva";
                        return res.status(200).json(apiResponse);
                    }
                    for (let i = 0; i < childCode.length; i++) {
                        const executionPartsNeed = Number(execut[i]);
                        const child = childCode[i];
                        const { childColdReturn } = apiResponse;
                        const returnSaveParts = Object.entries(childColdReturn);
                        const part = returnSaveParts[i] ? returnSaveParts[i][0] : "";
                        const value = Number(returnSaveParts[i] ? returnSaveParts[i][1] : "");
                        const add = addressForChildrenParts || addressForChildrenParts.length > 0 ? addressForChildrenParts.findIndex((el) => el.peca === part) : '';
                        const addressss = addressForChildrenParts[add] ? addressForChildrenParts[add].address : newAddress[i];
                        if (leftInOdf > 0) {
                            strQuery.push(`UPDATE ${process.env['MS_TABLE_CONTAINER_OF_PARTS_STORAGE']} SET ${process.env['MS_COLUMN_CONTAINER_OF_PARTS_STORAGE']} = ${process.env['MS_COLUMN_CONTAINER_OF_PARTS_STORAGE']} + ${executionPartsNeed * QTDE_LIB - totalValue * executionPartsNeed} WHERE 1 = 1 AND ${process.env['MS_COLUMN_CONTAINER_OF_PARTS_WHERE_CONDITION']} = '${String(child)}';`);
                            if (part && addressss) {
                                strQuery.push(`UPDATE CST_ESTOQUE_ENDERECOS SET QUANTIDADE = QUANTIDADE + ${executionPartsNeed * QTDE_LIB - totalValue * executionPartsNeed}, CODIGO = '${part}'  WHERE 1 = 1  AND ENDERECO = '${addressss}';`);
                            }
                            strQuery.push(`INSERT INTO ${process.env['MS_TABLE_STORAGE_POINTED_HISTORIC']} (${process.env['ROWS_TO_INSERT_ON_STORAGE_POINTED_HISTORIC']}) VALUES(GETDATE(), '${process.env['ROW_OF_STATUS_IN_STORAGE_POINTED_HISTORIC']}', '${NUMERO_ODF}', '${child}', ${executionPartsNeed * QTDE_LIB - totalValue * executionPartsNeed}, '${FUNCIONARIO}');`);
                        }
                        if (pointBadFeed && pointBadFeed > 0) {
                            if (part && addressss) {
                                strQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${value} WHERE 1 = 1 AND CODIGO = '${part}';`);
                                strQuery.push(`UPDATE CST_ESTOQUE_ENDERECOS SET QUANTIDADE = QUANTIDADE + ${value}, CODIGO = '${part}' WHERE 1 = 1  AND ENDERECO = '${addressss}';`);
                            }
                        }
                        ;
                        strQuery.push(`DELETE ${process.env['MS_TABLE_CONTAINER_OF_RESERVATION']} WHERE 1 = 1 AND ${process.env['MS_COLUMN_OF_FOR_ODF_CONDITION']} = '${NUMERO_ODF}' AND ${process.env['MS_COLUMN_OF_FOR_CHILD_PARTS_CONDITION']} = '${String(child)}';`);
                    }
                }
            }
        }
        async function insertodf(arrayOfPointCode, arrayOfPointFields, employeeAfter, valuesIfEmployeeItsDiferent) {
            insert = await (0, insert_1.insertInto)(arrayOfPointCode, employeeAfter, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, valuesIfEmployeeItsDiferent ? 0 : pointGoodFeed, valuesIfEmployeeItsDiferent ? 0 : pointBadFeed, arrayOfPointFields, apiResponse["tempoDecorrido"], apiResponse["selectedMotive"] || null, valuesIfEmployeeItsDiferent ? 0 : pointMissingFeed, valuesIfEmployeeItsDiferent ? 0 : pointReworkFeed);
            strQuery.push(insert);
        }
        if (RIP_MOD === "TRUE") {
            if (EMPLOYEE_MOD === "TRUE") {
                if (FUNCIONARIO !== employee) {
                    await insertodf([codeNumberFour, codeNumberFive, codeNumberSix], ["FIN PROD", "INI RIP", "FIN RIP"], employee, true);
                    await insertodf([codeNumberOne, codeNumberTwo, codeNumberThree, codeNumberFour, codeNumberFive,], ["INI SETUP", "FIN SETUP", "INI PROD", "FIN PROD", "INI RIP"], FUNCIONARIO, false);
                }
                else {
                    await insertodf([codeNumberFour, codeNumberFive], ["FIN PROD", "INI RIP"], FUNCIONARIO, false);
                }
            }
            else {
                await insertodf([codeNumberFour, codeNumberFive], ["FIN PROD", "INI RIP"], FUNCIONARIO, false);
            }
            apiResponse["code"] = (0, message_1.message)("RipIni");
        }
        else {
            if (EMPLOYEE_MOD === "TRUE") {
                if (FUNCIONARIO !== employee) {
                    await insertodf([codeNumberFour, codeNumberFive, codeNumberSix], ["FIN PROD", "INI RIP", "FIN RIP"], employee, true);
                    await insertodf([codeNumberOne, codeNumberTwo, codeNumberThree, codeNumberFour, codeNumberFive, codeNumberSix,
                    ], ["INI SETUP", "FIN SETUP", "INI PROD", "FIN PROD", "INI RIP", "FIN RIP"], FUNCIONARIO, false);
                }
                else {
                    await insertodf([codeNumberFour, codeNumberFive, codeNumberSix], ["FIN PROD", "INI RIP", "FIN RIP"], FUNCIONARIO, false);
                }
            }
            else {
                await insertodf([codeNumberFour, codeNumberFive, codeNumberSix], ["FIN PROD", "INI RIP", "FIN RIP"], FUNCIONARIO, false);
            }
            apiResponse["code"] = (0, message_1.message)("RipFin");
            const vwContainerOfOdfs = 0;
            const finalTimer = await (0, update_1.update)(vwContainerOfOdfs, {
                NUMERO_ODF,
                NUMERO_OPERACAO,
                CODIGO_MAQUINA,
            });
            strQuery.push(finalTimer);
        }
        if ((pointBadFeed > 0 || pointMissingFeed > 0 && indexOdf < groupOdf.length)) {
            if (groupOdf[indexOdf + 1]) {
                const newOperNumber = groupOdf[indexOdf + 1][`${process.env['MS_COLUMN_OF_FOR_ODF_OPERATION_NUMBER_CONDITION']}`];
                const newQtdOdf = Number(groupOdf[indexOdf][`${process.env['MS_COLUMN_FOR_ODF_QUANTITY']}`]) - QTD_REFUGO - QTD_FALTANTE - pointBadFeed - pointMissingFeed;
                const str = `UPDATE ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} SET ${process.env['MS_COLUMN_FOR_ODF_QUANTITY']} = ${newQtdOdf} WHERE 1 = 1 AND ${process.env['MS_COLUMN_OF_FOR_ODF_NUMBER_CONDITION']} = '${NUMERO_ODF}' AND ${process.env['MS_COLUMN_OF_FOR_ODF_OPERATION_NUMBER_CONDITION']} = '${newOperNumber}'`;
                strQuery.push(str);
            }
        }
        try {
            let updatePcpStr = await (0, update_1.update)(VWContainerOfOdf, {
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
                    const NUMERO_OPERACAO = groupOdf[indexOdf + 1][`${process.env['MS_COLUMN_OF_FOR_ODF_OPERATION_NUMBER_CONDITION']}`];
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
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            await connection.query(strQuery.join("\n"));
            await connection.close();
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            apiResponse["message"] = "Tempo excedido";
            console.log("Timeout linha 210:", error);
            return res.status(200).json(apiResponse);
        }
    }
}
exports.default = OdfServiceToPoint;
//# sourceMappingURL=odf.point.service.js.map