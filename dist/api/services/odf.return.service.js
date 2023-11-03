"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("./message");
const verifyCodeNote_1 = require("./verifyCodeNote");
const insert_1 = require("./insert");
const global_config_1 = require("../../global.config");
const mssql_1 = __importDefault(require("mssql"));
const query_1 = require("./query");
const odf_1 = __importDefault(require("../controllers/odf"));
const update_1 = require("./update");
class PointServiceReturn {
    async returnPoint(req, res) {
        const codeNumberEight = [8];
        const apiResponse = req.body || null;
        const { DEVOLUCAO_MOD, SUPERVISOR_MOD, RESERVA_MOD, supervisor, quantity } = apiResponse;
        const unraveledBarcode = odf_1.default.unravelBarcode({ barcode: apiResponse["barcode"] }) || null;
        if (!unraveledBarcode ||
            !unraveledBarcode["NUMERO_ODF"] ||
            !unraveledBarcode["NUMERO_OPERACAO"] ||
            !unraveledBarcode["CODIGO_MAQUINA"]) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({
            NUMERO_ODF: unraveledBarcode["NUMERO_ODF"],
            NUMERO_OPERACAO: unraveledBarcode["NUMERO_OPERACAO"],
            FUNCIONARIO: apiResponse["FUNCIONARIO"],
        }, [6]);
        const { code, accepted } = hisaponta;
        apiResponse["code"] = code;
        if (!accepted) {
            apiResponse["message"] = "ODF não pode ser estornada";
            return res.status(200).json(apiResponse);
        }
        if (!apiResponse["quantity"] ||
            Number.isNaN(Number(apiResponse["quantity"]))) {
            apiResponse["message"] = "Quantidade de estorno inválida";
            return res.status(200).json(apiResponse);
        }
        const viewOdfsGathered = 0;
        const groupOdf = await (0, query_1.select)(viewOdfsGathered, {
            NUMERO_ODF: unraveledBarcode["NUMERO_ODF"],
        });
        const index = groupOdf.findIndex((item) => {
            return ("00" + String(item["NUMERO_OPERACAO"]).replaceAll(" ", "0") ===
                String(unraveledBarcode["NUMERO_OPERACAO"]));
        });
        const odf = groupOdf[index] || null;
        const ar = [];
        for (let i = 0; i < groupOdf.length; i++) {
            ar.push(groupOdf[i]["QTDE_APONTADA"]);
        }
        let w = Math.min(...ar);
        let lastPointIndex;
        if (w === 0) {
            lastPointIndex =
                groupOdf.findIndex((item) => {
                    return item["QTDE_APONTADA"] === w;
                }) - 1;
        }
        else {
            lastPointIndex = groupOdf.findIndex((item) => {
                return item["QTDE_APONTADA"] === w;
            });
        }
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
        if (odf["QTDE_APONTADA "] <
            Number((apiResponse["goodFeed"] || 0) + (apiResponse["badFeed"] || 0)) ||
            odf["QTDE_APONTADA "] <= 0 ||
            (!odf["QTD_REFUGO"] && (apiResponse["badFeed"] || 0) > 0)) {
            apiResponse["message"] = (0, message_1.message)("NoLimit");
            return res.json(apiResponse);
        }
        else if (!odf ||
            "00" + odf["NUMERO_OPERACAO"].replaceAll(" ", "0") !==
                unraveledBarcode["NUMERO_OPERACAO"]) {
            apiResponse["message"] = "ODF não pode ser estornada";
            return res.status(200).json(apiResponse);
        }
        if (index <= 0) {
            odf["QTDE_LIB"] =
                odf["QTDE_ODF "] - odf["QTDE_APONTADA "] - odf["QTD_FALTANTE"];
        }
        else {
            odf["QTDE_LIB"] =
                (odf["QTD_BOAS"] || 0) -
                    (odf["QTD_BOAS"] || 0) -
                    (odf["QTD_REFUGO"] || 0) -
                    (odf["QTD_RETRABALHADA"] || 0) -
                    (odf["QTD_FALTANTE"] || 0);
        }
        if (DEVOLUCAO_MOD === "FALSE") {
            apiResponse["message"] = (0, message_1.message)("NoModule");
            return res.status(200).json(apiResponse);
        }
        if (SUPERVISOR_MOD === "TRUE") {
            if (supervisor === '0' || supervisor === "00" || supervisor === '000' || supervisor === "0000" || supervisor === '00000' || supervisor === "000000" || supervisor === '0000000' || supervisor === '00000000') {
                apiResponse["message"] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            const VIEW_GRUPO_APT = 10;
            const resultSupervisor = await (0, query_1.select)(VIEW_GRUPO_APT, { supervisor });
            if (!resultSupervisor) {
                apiResponse["message"] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
        }
        if (apiResponse["valueStorage"] === "BOAS") {
            apiResponse["pointGoodFeed"] = Number(apiResponse["quantity"]);
            if (!apiResponse["pointGoodFeed"] ||
                apiResponse["pointGoodFeed"] > odf["QTD_BOAS"]) {
                apiResponse["message"] = "Quantidade de estorno inválida";
                return res.status(200).json(apiResponse);
            }
        }
        else if (apiResponse["valueStorage"] === "RUINS") {
            apiResponse["pointGoodFeed"] = Number(apiResponse["quantity"]);
            if (!apiResponse["pointGoodFeed"] ||
                apiResponse["pointGoodFeed"] > odf["QTD_REFUGO"]) {
                apiResponse["message"] = "Quantidade de estorno inválida";
                return res.status(200).json(apiResponse);
            }
        }
        if (apiResponse["quantity"] > odf["QTDE_ODF"]) {
            apiResponse["message"] = "Quantidade liberada maior que a da ODF";
            return res.status(200).json(apiResponse);
        }
        let strQuery = [];
        if (RESERVA_MOD === "TRUE") {
            const PROCESSO = 22;
            const resource = (await (0, query_1.select)(PROCESSO, {
                NUMERO_ODF: unraveledBarcode["NUMERO_ODF"],
                NUMERO_OPERACAO: unraveledBarcode["NUMERO_OPERACAO"],
            }));
            if (resource) {
                const execut = resource.map((element) => element["EXECUT"]);
                const childCode = resource.map((item) => item["NUMITE"]);
                const process = resource
                    .map((item) => item["NUMSEQ"])
                    .filter((element) => element ===
                    String(String(unraveledBarcode["NUMERO_OPERACAO"]).replaceAll(" ", "")).replaceAll("000", ""));
                if (process.length > 0) {
                    for (let i = 0; i < childCode.length; i++) {
                        strQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${apiResponse["quantity"] * Number(execut[i])} WHERE 1 = 1 AND CODIGO = '${childCode[i]}'`);
                    }
                }
            }
        }
        try {
            const insertEight = await (0, insert_1.insertInto)(codeNumberEight, String(apiResponse["FUNCIONARIO"]), Number(unraveledBarcode["NUMERO_ODF"]), String(odf["CODIGO_PECA"]), String(odf["REVISAO"]), String(unraveledBarcode["NUMERO_OPERACAO"]
                .replaceAll(" ", "")
                .replaceAll("000", "")), String(unraveledBarcode["CODIGO_MAQUINA"]), Number(odf["QTDE_LIB"]), Number(apiResponse["pointGoodFeed"] || 0), Number(apiResponse["pointGoodFeed"] || 0), ["ESTORNO"], 0, null, 0, 0);
            if (!insertEight) {
                return res.status(200).json(apiResponse);
            }
            strQuery.push(insertEight[0]);
            const newValorApontado = Number(odf["QTD_BOAS"]) +
                Number(odf["QTD_REFUGO"]) +
                Number(odf["QTD_FALTANTE"]) +
                Number(odf["QTD_RETRABALHADA"]) -
                quantity;
            const PCP_PROGRAMACAO_PRODUCAO = 2;
            const updatedStr = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, {
                CODIGO_PECA: String(odf["CODIGO_PECA"]),
                valorApontado: newValorApontado,
                pointGoodFeed: apiResponse["pointGoodFeed"],
                missingFeed: 0,
                QTD_LIB: odf["QTDE_LIB"],
                pointBadFeed: apiResponse["pointGoodFeed"],
                valorTotal: apiResponse["quantity"],
                NUMERO_ODF: unraveledBarcode["NUMERO_ODF"],
                NUMERO_OPERACAO: unraveledBarcode["NUMERO_OPERACAO"],
                CODIGO_MAQUINA: unraveledBarcode["CODIGO_MAQUINA"],
            });
            strQuery.push(updatedStr);
            strQuery = strQuery.join("\n");
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
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            console.log("Error on insertEight", error);
            return res.status(200).json(apiResponse);
        }
    }
}
exports.default = PointServiceReturn;
//# sourceMappingURL=odf.return.service.js.map