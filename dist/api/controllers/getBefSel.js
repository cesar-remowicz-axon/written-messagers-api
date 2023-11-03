"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBefore = void 0;
const mssql_1 = __importDefault(require("mssql"));
const global_config_1 = require("../../global.config");
const sanitize_1 = require("../utils/sanitize");
const getBefore = async (req, res, next) => {
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    const numerOdf = Number((0, sanitize_1.sanitize)(req.cookies["NUMERO_ODF"]));
    const numerOper = String((0, sanitize_1.sanitize)(req.cookies["NUMERO_OPERACAO"]));
    const codMaq = String((0, sanitize_1.sanitize)(req.cookies["CODIGO_MAQUINA"]));
    const numeroPeca = String((0, sanitize_1.sanitize)(req.cookies['CODIGO_PECA']));
    try {
        const checkForOdf = await connection.query(`
        SELECT
        TOP 1
        CODAPONTA
        FROM 
        HISAPONTA
        WHERE 1 = 1 
        AND ODF = ${numerOdf}
        AND NUMOPE = ${numerOper}
        AND ITEM = '${codMaq}'
        ORDER BY NUMERO_OPERACAO ASC
        `).then(res => res.recordset);
        if (numeroPeca !== checkForOdf[0].CODIGO_PECA) {
            return res.json({ message: 'dados não conferem' });
        }
        if (checkForOdf.length > 0) {
            next();
        }
        else {
            return res.json({ message: 'dados não conferem' });
        }
    }
    catch (error) {
        console.log(error);
        return res.json({ error: true, message: "Erro no servidor." });
    }
    finally {
    }
};
exports.getBefore = getBefore;
//# sourceMappingURL=getBefSel.js.map