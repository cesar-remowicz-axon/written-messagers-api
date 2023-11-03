"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = require("../../global.config");
const mssql_1 = __importDefault(require("mssql"));
const unravelBarcode_1 = require("../utils/unravelBarcode");
const cookies_1 = __importDefault(require("../controllers/cookies"));
class PointServiceSuport {
    async suport(req, res) {
        const apiResponse = req.body || null;
        const { barcode } = apiResponse;
        if (!barcode) {
            apiResponse["message"] = "Erro ao localizar código de barras";
            return res.status(200).json(apiResponse);
        }
        if (barcode.length <= 5) {
            apiResponse["message"] = "Código de barras inválido";
            return res.status(200).json(apiResponse);
        }
        let NUMERO_ODF, NUMERO_OPERACAO = '';
        if (barcode.length > 10) {
            ({ NUMERO_ODF, NUMERO_OPERACAO } = await (0, unravelBarcode_1.unravelBarcode)({
                barcode,
            }));
        }
        else {
            NUMERO_ODF = barcode;
        }
        NUMERO_ODF = Number(NUMERO_ODF);
        if (!NUMERO_ODF) {
            apiResponse["message"] = "Código de barras inválido";
            return res.status(200).json(apiResponse);
        }
        apiResponse["NUMERO_ODF"] = NUMERO_ODF;
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        const resource = await connection
            .query(`
            SELECT REVISAO, NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_ODF, QTDE_APONTADA, QTDE_LIB, CODIGO_PECA, QTD_BOAS, QTD_REFUGO, QTD_FALTANTE, QTD_RETRABALHADA, CODIGO_CLIENTE, QTD_ESTORNADA, HORA_FIM, HORA_INICIO,
            DT_FIM_OP, DT_INICIO_OP
                FROM ${process.env['viewOdfsGathered']} (NOLOCK) WHERE 1 = 1 AND NUMERO_ODF = '${NUMERO_ODF}' AND CODIGO_PECA IS NOT NULL ORDER BY NUMERO_OPERACAO ASC
            `)
            .then((result) => result["recordset"]);
        if (!resource[0]) {
            apiResponse["message"] = "Erro ao localizar ODF";
        }
        else {
            const hisapontaResult = await connection
                .query(`
                    SELECT DATAHORA, USUARIO, NUMOPE, ITEM, QTD, PC_BOAS, PC_REFUGA, CODAPONTA, CAMPO1, CONDIC FROM HISAPONTA WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' ORDER BY R_E_C_N_O_ ASC
                `)
                .then((result) => result["recordset"]);
            const buckets = {};
            if (hisapontaResult[0]) {
                for (let i = 0; i < hisapontaResult["length"]; i++) {
                    const numOper = hisapontaResult[i].NUMOPE;
                    if (!(numOper in buckets)) {
                        buckets[numOper] = [];
                    }
                    buckets[numOper].push(hisapontaResult[i]);
                }
                apiResponse["hisaponta"] = buckets;
            }
            const alocado = await connection
                .query(`
                SELECT * FROM ALOCACAO_POINT WHERE 1 = 1 AND ODF = '${NUMERO_ODF}'
                `)
                .then((result) => result["recordset"]);
            if (alocado[0] || alocado["length"] > 0) {
                apiResponse["alocado"] = alocado;
                NUMERO_OPERACAO = alocado[0].NUMOPE;
            }
            for (const [key, value] of Object.entries(resource[0])) {
                apiResponse[key] = value;
            }
        }
        apiResponse["result"] = resource;
        if (NUMERO_ODF && NUMERO_OPERACAO) {
            await cookies_1.default.generate(res, { NUMERO_ODF, NUMERO_OPERACAO });
        }
        return res.status(200).json(apiResponse);
    }
}
exports.default = PointServiceSuport;
//# sourceMappingURL=odf.suport.service.js.map