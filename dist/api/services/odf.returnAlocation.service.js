"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = require("../../global.config");
const mssql_1 = __importDefault(require("mssql"));
const query_1 = require("./query");
class PointServiceRetAlocation {
    async returnAlocation(req, res) {
        const apiResponse = req.body;
        const { NUMERO_ODF, NUMERO_OPERACAO } = apiResponse;
        if (!NUMERO_ODF || !NUMERO_OPERACAO) {
            apiResponse["message"] = "Reserva não encontrada";
            return res.status(200).json(apiResponse);
        }
        const alocationQuery = 22;
        const resource = (await (0, query_1.select)(alocationQuery, { NUMERO_ODF, NUMERO_OPERACAO })) || null;
        if (!resource) {
            apiResponse["message"] = "Reserva não encontrada";
            return res.status(200).json(apiResponse);
        }
        const strQuery = [""];
        for (let i = 0; i < Object.entries(resource).length; i++) {
            const iterator = resource[i];
            strQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${iterator["RESERVADO"]} WHERE 1 = 1 AND CODIGO  = '${iterator["NUMITE"]}' `);
        }
        strQuery.push(`DELETE ALOCACAO_POINT WHERE 1 = 1 AND ODF = '${NUMERO_ODF}'`);
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        const resourOfHisa = await connection
            .query(`SELECT * FROM HISAPONTA WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' ORDER BY R_E_C_N_O_ DESC`)
            .then((result) => result["recordset"]);
        const firstThree = resourOfHisa["slice"](0, 3);
        for (let i = 0; i < Object.entries(firstThree).length; i++) {
            const iterator = firstThree[i];
            if (iterator["CODAPONTA"] === 3) {
                const id1 = firstThree[0].R_E_C_N_O_;
                strQuery.push(`DELETE HISAPONTA WHERE 1 = 1 AND R_E_C_N_O_ = '${id1}'`);
                const id2 = firstThree[1].R_E_C_N_O_;
                strQuery.push(`DELETE HISAPONTA WHERE 1 = 1 AND R_E_C_N_O_ = '${id2}'`);
                const id3 = firstThree[2].R_E_C_N_O_;
                strQuery.push(`DELETE HISAPONTA WHERE 1 = 1 AND R_E_C_N_O_ = '${id3}'`);
            }
            else if (iterator["CODAPONTA"] === 2) {
                const id1 = firstThree[0].R_E_C_N_O_;
                strQuery.push(`DELETE HISAPONTA WHERE 1 = 1 AND R_E_C_N_O_ = '${id1}'`);
                const id2 = firstThree[1].R_E_C_N_O_;
                strQuery.push(`DELETE HISAPONTA WHERE 1 = 1 AND R_E_C_N_O_ = '${id2}'`);
            }
            else if (iterator["CODAPONTA"] === 1) {
                const id1 = firstThree[0].R_E_C_N_O_;
                strQuery.push(`DELETE HISAPONTA WHERE 1 = 1 AND R_E_C_N_O_ = '${id1}'`);
            }
        }
        await connection
            .query(strQuery.join(""))
            .then((result) => result.rowsAffected);
        return res.status(200).json(apiResponse);
    }
}
exports.default = PointServiceRetAlocation;
//# sourceMappingURL=odf.returnAlocation.service.js.map