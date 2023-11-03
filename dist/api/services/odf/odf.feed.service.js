"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const insert_1 = require("../../utils/insert");
const global_config_1 = require("../../../global.config");
const mssql_1 = __importDefault(require("mssql"));
const pictures_1 = require("../../pictures");
const message_1 = require("../../utils/message");
const query_1 = require("../../utils/query");
const verifyCodeNote_1 = require("../../utils/verifyCodeNote");
class PointServiceFeed {
    async feed(req, res) {
        const codeNumberThree = 3;
        const lastProcessOnOdf = "999";
        const result = [];
        const allowedCodePointed = [2, 3, 4, 5, 6, 7];
        const mode = process.env['MODE'];
        const apiResponse = req.body;
        let { NUMERO_ODF, FUNCIONARIO, CODIGO_PECA, CODIGO_MAQUINA, REVISAO, NUMERO_OPERACAO, QTDE_LIB, supervisor, SUPERVISOR_MOD, DESENHO_TECNICO_MOD, QTD_BOAS, QTDE_ODF, QTD_REFUGO, QTD_RETRABALHADA, QTD_FALTANTE, QTDE_APONTADA, } = apiResponse;
        NUMERO_OPERACAO = String(Number(String(NUMERO_OPERACAO)));
        CODIGO_MAQUINA = String(CODIGO_MAQUINA).replaceAll(" ", "");
        NUMERO_ODF = String(NUMERO_ODF).replaceAll(" ", "");
        CODIGO_PECA = String(CODIGO_PECA).replaceAll(" ", "");
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
            typeof QTDE_APONTADA !== "number" ||
            typeof FUNCIONARIO !== 'string') {
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
        const { code, accepted, time } = await (0, verifyCodeNote_1.codePoint)({
            NUMERO_ODF,
            NUMERO_OPERACAO,
            FUNCIONARIO,
        }, allowedCodePointed);
        if (!accepted) {
            return res.status(200).json(apiResponse);
        }
        apiResponse["code"] = code;
        if (code === (0, message_1.message)("SetupFin")) {
            const insertThree = await (0, insert_1.insertInto)([codeNumberThree], FUNCIONARIO, Number(NUMERO_ODF), String(CODIGO_PECA), String(REVISAO), String(NUMERO_OPERACAO), String(CODIGO_MAQUINA), QTDE_LIB, null, null, ["INI PROD"], new Date().getTime(), null, null, null);
            apiResponse["code"] = (0, message_1.message)("ProdIni");
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            const insertThreeResult = await connection
                .query(`${insertThree}`)
                .then((result) => result.rowsAffected);
            await connection.close();
            if (!insertThreeResult ||
                insertThreeResult.length <= 0) {
                apiResponse["code"] = (0, message_1.message)("SetupFin");
                apiResponse["message"] = "Erro ao Iniciar produção";
            }
        }
        let resource;
        if (String(CODIGO_PECA).includes("RE.")) {
            const pcp = "PCPTOP1";
            resource = await (0, query_1.select)(pcp, {
                NUMERO_ODF,
                NUMERO_OPERACAO,
                CODIGO_MAQUINA,
                REVISAO,
                CODIGO_PECA,
            });
        }
        else {
            resource = await (0, query_1.select)('feedOdf', {
                NUMERO_ODF,
                NUMERO_OPERACAO,
                CODIGO_MAQUINA,
                REVISAO,
                CODIGO_PECA,
            });
        }
        if (!resource) {
            apiResponse["message"] = (0, message_1.message)("ReqError");
            return res.status(200).json(apiResponse);
        }
        const ppedliseResource = await (0, query_1.select)('resourceForOdfNumberRequest', { odfNumber: NUMERO_ODF, part: CODIGO_PECA, revisionPhase: REVISAO });
        if (ppedliseResource) {
            const realQuantityInRequest = ppedliseResource[0].quantity;
            if (realQuantityInRequest !== QTDE_ODF) {
            }
        }
        if (DESENHO_TECNICO_MOD === "TRUE") {
            for await (const [i, record] of Object.entries(resource)) {
                const { NUMPEC, IMAGEM } = await record;
                if (NUMPEC &&
                    NUMPEC !== "undefined" &&
                    NUMPEC !== "null" &&
                    IMAGEM &&
                    IMAGEM !== "undefined" &&
                    IMAGEM !== "null") {
                    const path = await pictures_1.pictures.getPicturePath(NUMPEC, IMAGEM, "_status", String(i));
                    result.push(path);
                }
                else {
                    result.push("/images/sem_imagem.gif");
                }
            }
            resource[0]["IMAGEM"] = result;
        }
        if (SUPERVISOR_MOD === "TRUE") {
            if (supervisor) {
                resource[0]["VERIFICADO"] = true;
            }
        }
        const moment = new Date();
        const { HORA_FIM, DT_FIM_OP } = resource[0];
        if (DT_FIM_OP && HORA_FIM) {
            const year = parseInt(DT_FIM_OP.substr(0, 4));
            const month = parseInt(DT_FIM_OP.substr(4, 2)) - 1;
            const day = parseInt(DT_FIM_OP.substr(6, 2));
            const prodFinalDate = new Date(Date.UTC(year, month, day, HORA_FIM.getUTCHours(), HORA_FIM.getUTCMinutes(), HORA_FIM.getUTCSeconds(), HORA_FIM.getUTCMilliseconds()));
            if (moment > prodFinalDate) {
                resource[0]["EXECUT"] = 0;
            }
            else {
                const { HORA_INICIO, DT_INICIO_OP } = resource[0];
                const year = parseInt(DT_INICIO_OP.substr(0, 4));
                const month = parseInt(DT_INICIO_OP.substr(4, 2)) - 1;
                const day = parseInt(DT_INICIO_OP.substr(6, 2));
                const prodInicialDate = new Date(Date.UTC(year, month, day, HORA_INICIO.getUTCHours(), HORA_INICIO.getUTCMinutes(), HORA_INICIO.getUTCSeconds(), HORA_INICIO.getUTCMilliseconds()));
                if (new Date(time) < prodInicialDate) {
                    const timeToPoint = 30000;
                    const timeSpendForEntireProd = Number(resource[0]["EXECUT"] * QTDE_LIB * 1000);
                    const timeThatShouldTook = new Date(Number(time) + timeSpendForEntireProd + timeToPoint);
                    if (timeThatShouldTook < moment) {
                        resource[0]["EXECUT"] = timeToPoint + (timeThatShouldTook.getTime() - moment.getTime());
                    }
                    else {
                        resource[0]["EXECUT"] = 0;
                    }
                }
                else {
                    resource[0]["EXECUT"] = (prodFinalDate.getTime() - moment.getTime());
                }
            }
        }
        else {
            resource[0]["EXECUT"] = 0;
        }
        for (const [key, value] of Object.entries(resource[0])) {
            apiResponse[key] = value;
        }
        if (mode !== 'Demo') {
            if (NUMERO_OPERACAO === lastProcessOnOdf) {
                const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
                const address = await connection
                    .query(`SELECT QUANTIDADE FROM ${process.env['MS_TABLE_OF_ADDRESS']} WHERE 1 = 1 AND ODF = '${NUMERO_ODF}'`)
                    .then((result) => result["recordset"]);
                await connection.close();
                let sumInAdd = 0;
                if (address["length"] > 0) {
                    for (let i = 0; i < address["length"]; i++) {
                        const value = Number(address[i].QUANTIDADE);
                        sumInAdd += value;
                    }
                    if (typeof sumInAdd !== 'number') {
                        apiResponse["message"] = (0, message_1.message)("ReqError");
                        return res.status(200).json(apiResponse);
                    }
                    if (Number.isNaN(sumInAdd) || sumInAdd === null || sumInAdd === undefined || sumInAdd < 0 || sumInAdd === Infinity) {
                        apiResponse["message"] = (0, message_1.message)("ReqError");
                        return res.status(200).json(apiResponse);
                    }
                    apiResponse["QTDE_ENDERECADO"] = sumInAdd;
                }
            }
        }
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = PointServiceFeed;
//# sourceMappingURL=odf.feed.service.js.map