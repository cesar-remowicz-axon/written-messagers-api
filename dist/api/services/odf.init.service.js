"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unravelBarcode_1 = require("../utils/unravelBarcode");
const selectIfHasP_1 = require("./selectIfHasP");
const global_config_1 = require("../../global.config");
const verifyCodeNote_1 = require("./verifyCodeNote");
const cookies_1 = __importDefault(require("../controllers/cookies"));
const insert_1 = require("./insert");
const message_1 = require("./message");
const query_1 = require("./query");
const update_1 = require("./update");
const mssql_1 = __importDefault(require("mssql"));
class PointServiceToInit {
    async init(req, res) {
        const apiResponse = req.body;
        let { barcode, ESTOQUE_MOD, FERRAMENTA_MOD, FUNCIONARIO, statusConfig, supervisorChecked } = apiResponse;
        if (!FUNCIONARIO || typeof FUNCIONARIO !== 'string') {
            apiResponse["message"] = 'Crachá de funcionário inválido';
            return res.status(200).json(apiResponse);
        }
        if (!barcode || typeof barcode !== 'string') {
            apiResponse["message"] = 'Código de barras inválido';
            return res.status(200).json(apiResponse);
        }
        let { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA } = await (0, unravelBarcode_1.unravelBarcode)({ barcode: barcode });
        NUMERO_OPERACAO = Number(NUMERO_OPERACAO);
        CODIGO_MAQUINA = String(CODIGO_MAQUINA.replaceAll(" ", ""));
        NUMERO_ODF = String(NUMERO_ODF.replaceAll(" ", ""));
        if (!NUMERO_ODF || !NUMERO_OPERACAO || !CODIGO_MAQUINA) {
            apiResponse["message"] = 'Dados de operação inválidos';
            return res.status(200).json(apiResponse);
        }
        const allowedCodePointed = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const codeNumberOneToThree = [1, 2, 3];
        const PCP_PROGRAMACAO_PRODUCAO = 1;
        const viewOdfsGathered = 0;
        const codeNumberOne = [1];
        let insert = '';
        const array = [];
        const groupOdf = (await (0, query_1.select)(viewOdfsGathered, {
            NUMERO_ODF,
        }));
        if (!groupOdf || groupOdf.length === 0) {
            apiResponse["message"] = 'ODF não encontrada';
            return res.status(200).json(apiResponse);
        }
        const indexOdf = groupOdf.findIndex((item) => {
            return (Number(item["NUMERO_OPERACAO"]) ===
                NUMERO_OPERACAO);
        });
        if (indexOdf < 0 || !groupOdf[indexOdf]) {
            apiResponse["message"] = 'ODF não encontrada';
            return res.status(200).json(apiResponse);
        }
        const odf = groupOdf[indexOdf];
        if (!odf || !Object.keys(odf).length) {
            apiResponse["message"] = 'ODF não encontrada';
            return res.status(200).json(apiResponse);
        }
        let { QTDE_LIB, QTD_BOAS, QTD_REFUGO, QTD_RETRABALHADA, QTD_FALTANTE, QTDE_APONTADA, QTDE_ODF, CODIGO_PECA, REVISAO, QTD_ESTORNADA, } = odf;
        QTD_BOAS = Number(QTD_BOAS);
        QTD_REFUGO = Number(QTD_REFUGO);
        QTDE_LIB = Number(QTDE_LIB);
        QTD_RETRABALHADA = Number(QTD_RETRABALHADA);
        QTD_FALTANTE = Number(QTD_FALTANTE);
        QTDE_APONTADA = Number(QTDE_APONTADA);
        QTDE_ODF = Number(QTDE_ODF);
        QTD_ESTORNADA = Number(QTD_ESTORNADA);
        CODIGO_PECA = String(CODIGO_PECA).toUpperCase();
        REVISAO = String(REVISAO).toUpperCase();
        if (!CODIGO_PECA ||
            CODIGO_PECA === "undefined" ||
            CODIGO_PECA === "null" ||
            CODIGO_PECA === "Infinity" ||
            CODIGO_PECA === "NaN" ||
            !REVISAO ||
            REVISAO === "undefined" ||
            REVISAO === "null" ||
            REVISAO === "Infinity" ||
            REVISAO === "NaN") {
            apiResponse["message"] =
                "Não pode ser iniciado, tente novamente ou verifique a ODF";
            return res.status(200).json(apiResponse);
        }
        if (QTD_REFUGO === null ||
            QTD_REFUGO === undefined ||
            QTD_REFUGO === Infinity ||
            Number.isNaN(QTD_REFUGO) ||
            QTD_REFUGO < 0 ||
            QTD_BOAS === null ||
            QTD_BOAS === undefined ||
            QTD_BOAS === Infinity ||
            Number.isNaN(QTD_BOAS) ||
            QTD_BOAS < 0 ||
            QTDE_LIB === null ||
            QTDE_LIB === undefined ||
            QTDE_LIB === Infinity ||
            Number.isNaN(QTDE_LIB) ||
            QTDE_LIB < 0 ||
            QTD_RETRABALHADA === null ||
            QTD_RETRABALHADA === undefined ||
            QTD_RETRABALHADA === Infinity ||
            Number.isNaN(QTD_RETRABALHADA) ||
            QTD_RETRABALHADA < 0 ||
            QTD_FALTANTE === null ||
            QTD_FALTANTE === undefined ||
            QTD_FALTANTE === Infinity ||
            Number.isNaN(QTD_FALTANTE) ||
            QTD_FALTANTE < 0 ||
            QTDE_ODF === null ||
            QTDE_ODF === undefined ||
            QTDE_ODF === Infinity ||
            Number.isNaN(QTDE_ODF) ||
            QTDE_ODF < 0 ||
            QTDE_APONTADA === null ||
            QTDE_APONTADA === undefined ||
            QTDE_APONTADA === Infinity ||
            Number.isNaN(QTDE_APONTADA) ||
            QTDE_APONTADA < 0 ||
            QTD_ESTORNADA === null ||
            QTD_ESTORNADA === undefined ||
            QTD_ESTORNADA === Infinity ||
            Number.isNaN(QTD_ESTORNADA) ||
            QTD_ESTORNADA < 0) {
            apiResponse["message"] =
                "Não pode ser iniciado, tente novamente ou verifique a ODF";
            return res.status(200).json(apiResponse);
        }
        if (indexOdf <= 0) {
            odf["QTDE_LIB"] =
                QTDE_ODF -
                    (QTD_BOAS +
                        QTD_REFUGO +
                        QTD_FALTANTE -
                        QTD_ESTORNADA);
        }
        else {
            odf["QTDE_LIB"] =
                Number(groupOdf[indexOdf - 1]["QTD_BOAS"]) -
                    QTD_BOAS -
                    QTD_REFUGO -
                    QTD_RETRABALHADA -
                    QTD_FALTANTE +
                    QTD_ESTORNADA;
            const anteriorQtdOdf = Number(groupOdf[indexOdf - 1]["QTDE_ODF"]);
            const anteriorBadFeedOdf = Number(groupOdf[indexOdf - 1]["QTD_REFUGO"]);
            const anteriorMissingFeedOdf = Number(groupOdf[indexOdf - 1]["QTD_FALTANTE"]);
            const qtdOdf = anteriorQtdOdf -
                (anteriorBadFeedOdf + anteriorMissingFeedOdf);
            QTDE_ODF = qtdOdf;
            let { NUMERO_OPERACAO } = odf;
            NUMERO_OPERACAO = String(NUMERO_OPERACAO).replaceAll(" ", "");
            const PCP_PROGRAMACAO_PRODUCAO = 5;
            array.push(await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, {
                QTDE_LIB: odf["QTDE_LIB"],
                QTDE_ODF,
                NUMERO_ODF,
                NUMERO_OPERACAO: String(NUMERO_OPERACAO),
            }));
        }
        const { code, accepted } = await (0, verifyCodeNote_1.codePoint)({
            NUMERO_ODF,
            NUMERO_OPERACAO,
            FUNCIONARIO,
        }, allowedCodePointed);
        if (!code || code === 'FIN RIP') {
            apiResponse['message'] = 'Novo inicio';
        }
        if (!accepted) {
            apiResponse["message"] = "Não pode ser iniciado";
            return res.status(200).json(apiResponse);
        }
        odf["QTDE_LIB"] = odf["QTDE_LIB"];
        odf["qtdReserved"] = odf["QTDE_LIB"];
        odf["condic"] = "SEM CONDIC";
        odf["childCode"] = [];
        odf["execut"] = [];
        await cookies_1.default.generate(res, odf);
        if (QTDE_APONTADA === QTDE_ODF) {
            if (code !== "INI RIP") {
                apiResponse["message"] = (0, message_1.message)("Pointed");
                return res.status(200).json(apiResponse);
            }
        }
        else if (Number(odf["QTDE_LIB"]) <= 0) {
            if (code !== "INI RIP") {
                apiResponse["message"] = (0, message_1.message)("NoLimit");
                return res.status(200).json(apiResponse);
            }
        }
        apiResponse["code"] = code;
        if (ESTOQUE_MOD === "TRUE") {
            const components = await (0, selectIfHasP_1.checkForComponents)({
                NUMERO_ODF,
                NUMERO_OPERACAO,
                CODIGO_PECA,
                QTDE_LIB: odf["QTDE_LIB"],
                FUNCIONARIO,
            });
            if (components["message"] === (0, message_1.message)("NoLimit") ||
                Number(components["quantidade"]) <= 0) {
                apiResponse["message"] = `Sem quantidade para apontamento : ${components["semLimite"]}`;
                return res.status(200).json(apiResponse);
            }
            else {
                apiResponse["childCode"] = components["childCode"] || [""];
            }
            if (components["message"] !== 'Sucesso') {
                apiResponse["message"] = components["message"];
            }
            if (Array.isArray(components["insertAddressUpdate"]) &&
                components["insertAddressUpdate"].length > 0) {
                for (let i = 0; i < components["insertAddressUpdate"].length; i++) {
                    const strComponents = components["insertAddressUpdate"][i];
                    array.push(strComponents);
                }
            }
            odf['valorUnitario'] = components['valorUnitario'];
            odf["QTDE_LIB"] = !components["quantidade"]
                ? odf["QTDE_LIB"]
                : components["quantidade"];
            odf["qtdReserved"] = !components["quantidade"]
                ? odf["QTDE_LIB"]
                : components["quantidade"];
            odf["condic"] = !components["condic"]
                ? "SEM CONDIC"
                : components["condic"];
            odf["childCode"] = !components["childCode"]
                ? []
                : components["childCode"];
            odf["execut"] = !components["execut"] ? [] : components["execut"];
        }
        if (code === null || code === (0, message_1.message)("RipFin") || code === (0, message_1.message)("Return")) {
            apiResponse["code"] = (0, message_1.message)("SetupIni");
            if (FERRAMENTA_MOD === "TRUE") {
                if (statusConfig['toolsPage']) {
                    if (supervisorChecked && supervisorChecked !== 'null') {
                        insert = await (0, insert_1.insertInto)(codeNumberOneToThree, FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, Number(odf["QTDE_LIB"]), null, null, ["INI SETUP", "FIN SETUP", "INI PROD"], new Date().getTime(), null, null, null);
                        apiResponse["code"] = (0, message_1.message)("ProdIni");
                    }
                    else {
                        apiResponse["message"] = "Supervisor não encontrado";
                        return res.status(200).json(apiResponse);
                    }
                }
                else {
                    insert = await (0, insert_1.insertInto)(codeNumberOne, FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, Number(odf["QTDE_LIB"]), null, null, ["INI SETUP"], new Date().getTime(), null, null, null);
                }
            }
            else {
                insert = await (0, insert_1.insertInto)(codeNumberOneToThree, FUNCIONARIO, Number(NUMERO_ODF), CODIGO_PECA, REVISAO, String(NUMERO_OPERACAO), CODIGO_MAQUINA, Number(odf["QTDE_LIB"]), null, null, ["INI SETUP", "FIN SETUP", "INI PROD"], new Date().getTime(), null, null, null);
                apiResponse["code"] = (0, message_1.message)("ProdIni");
            }
        }
        array.push(insert);
        array.push(await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, {
            QTDE_LIB: Number(odf["QTDE_LIB"]),
            NUMERO_ODF,
            NUMERO_OPERACAO,
        }));
        try {
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            await connection
                .query(array.join(""))
                .then((result) => result.rowsAffected);
            await cookies_1.default.generate(res, odf);
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            console.log("Init ODF error:", error);
            apiResponse["message"] = "Erro ao iniciar apontamento";
            return res.status(500).json(apiResponse);
        }
    }
}
exports.default = PointServiceToInit;
//# sourceMappingURL=odf.init.service.js.map