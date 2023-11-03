"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.draw = void 0;
const mssql_1 = __importDefault(require("mssql"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const global_config_1 = require("../../global.config");
const pictures_1 = require("../pictures");
const draw = async (req, res) => {
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    const revisao = Number((0, sanitize_html_1.default)(req.cookies['REVISAO'])) || 0;
    const numpec = String((0, sanitize_html_1.default)(req.cookies["CODIGO_PECA"])) || null;
    let desenho = String("_desenho");
    if (revisao === 0) {
        console.log("linha 13 / draw/ ");
    }
    try {
        const resource = await connection.query(`
        SELECT
        DISTINCT
            [NUMPEC],
            [IMAGEM],
            [REVISAO]
        FROM  QA_LAYOUT(NOLOCK) 
        WHERE 1 = 1 
            AND NUMPEC = '${numpec}'
            AND REVISAO = '${revisao}'
            AND IMAGEM IS NOT NULL`).then(res => res.recordset);
        let imgResult = [];
        for await (let [i, record] of resource.entries()) {
            const rec = await record;
            const path = await pictures_1.pictures.getPicturePath(rec["NUMPEC"], rec["IMAGEM"], desenho, String(i));
            imgResult.push(path);
        }
        return res.status(200).json(imgResult);
    }
    catch (error) {
        console.log(error);
        return res.json({ error: true, message: "Erro no servidor." });
    }
    finally {
    }
};
exports.draw = draw;
//# sourceMappingURL=draw.js.map