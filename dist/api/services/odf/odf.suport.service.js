"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = __importDefault(require("mssql"));
const global_config_1 = require("../../../global.config");
const cookies_1 = __importDefault(require("../../controllers/cookies"));
const unravelBarcode_1 = require("../../utils/unravelBarcode");
class OdfServiceSuport {
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
            SELECT ${process.env['MS_COLUMN_FOR_VIEW_ODF_GATHERED']} FROM ${process.env['viewOdfsGathered']} (NOLOCK) WHERE 1 = 1 AND NUMERO_ODF = '${NUMERO_ODF}' AND CODIGO_PECA IS NOT NULL ORDER BY NUMERO_OPERACAO ASC;`)
            .then((result) => result["recordset"]);
        if (!resource[0]) {
            apiResponse["message"] = "Erro ao localizar ODF";
        }
        else {
            const hisapontaResult = await connection
                .query(`
                    SELECT ${process.env['MS_COLUMN_FOR_POINTED_CODES']} FROM ${process.env['MS_TABLE_CONTAINER_OF_POINTED_CODES']} WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' ORDER BY ${process.env['MS_COLUMN_ORDER_FROM_POINTED_CODES']} ASC;`)
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
                .query(`SELECT ${process.env['MS_COLUMN_FOR_RESERVATION']} FROM ${process.env['MS_TABLE_CONTAINER_OF_RESERVATION']} WHERE 1 = 1 AND ODF = '${NUMERO_ODF}';`)
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
        await connection.close();
        return res.status(200).json(apiResponse);
    }
}
exports.default = OdfServiceSuport;
//# sourceMappingURL=odf.suport.service.js.map