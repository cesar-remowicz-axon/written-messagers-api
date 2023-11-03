"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = __importDefault(require("mssql"));
const verifyCodeNote_1 = require("../../utils/verifyCodeNote");
const message_1 = require("../../utils/message");
const insert_1 = require("../../utils/insert");
const global_config_1 = require("../../../global.config");
const pictures_1 = require("../../pictures");
const query_1 = require("../../utils/query");
class ToolServiceFindAll {
    constructor() { }
    ;
    async findTools(req, res) {
        const allowedCodePointed = [6, 7, 8, 9];
        const apiResponse = req.body || null;
        let { FERRAMENTA_MOD, NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, CODIGO_PECA, REVISAO, QTDE_LIB, FUNCIONARIO } = apiResponse;
        NUMERO_OPERACAO = String(Number(String(NUMERO_OPERACAO)));
        CODIGO_MAQUINA = String(CODIGO_MAQUINA).replaceAll(' ', '');
        NUMERO_ODF = String(NUMERO_ODF).replaceAll(' ', '');
        if (typeof FUNCIONARIO !== 'string' || typeof CODIGO_PECA !== 'string' || typeof REVISAO !== 'string') {
            apiResponse['message'] = 'Erro ao indentificar funcionario';
            return res.json(apiResponse);
        }
        const { code } = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO }, allowedCodePointed);
        apiResponse['code'] = code;
        if (code === (0, message_1.message)("RipFin") || code === (0, message_1.message)("Return")) {
            const codeNumberOne = [1];
            const insertOne = await (0, insert_1.insertInto)(codeNumberOne, FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, Number(QTDE_LIB), null, null, ["INI SETUP"], new Date().getTime(), null, null, null);
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            const data = await connection.query(insertOne).then((result) => result.rowsAffected);
            await connection.close();
            if (!data || data.length <= 0) {
                apiResponse['message'] = "Erro ao iniciar apontamento";
                return res.json(apiResponse);
            }
            apiResponse['code'] = (0, message_1.message)("SetupIni");
        }
        ;
        if (FERRAMENTA_MOD === 'TRUE') {
            const result = [];
            const resource = await (0, query_1.select)("vwContaningToolsData", { NUMERO_OPERACAO, CODIGO_MAQUINA, CODIGO_PECA, });
            if (!resource) {
                apiResponse['result'] = null;
                apiResponse['message'] = (0, message_1.message)("NoTools");
                return res.json(apiResponse);
            }
            const arrayOfParts = resource.map((element) => String(element.CODIGO).replaceAll(' ', ''));
            const addressParts = await (0, query_1.select)('findAddressForTools', { parts: arrayOfParts.join(',') });
            for await (const [i, record] of resource.entries()) {
                const { CODIGO, IMAGEM } = await record;
                const path = await pictures_1.pictures.getPicturePath(CODIGO, IMAGEM, "_ferr", String(i));
                result.push(path);
            }
            apiResponse['result'] = result;
            apiResponse['address'] = addressParts;
        }
        else {
            apiResponse['message'] = "Modulo não suportado";
        }
        return res.json(apiResponse);
    }
    ;
}
exports.default = ToolServiceFindAll;
//# sourceMappingURL=findTools.service.js.map