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
class ToolServiceSelectedTools {
    constructor() { }
    ;
    async selected(req, res) {
        const allowedCodePointed = [1, 7];
        const apiResponse = req.body || null;
        let { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, FUNCIONARIO, CODIGO_PECA, REVISAO, QTDE_LIB } = apiResponse;
        NUMERO_OPERACAO = String(Number(String(NUMERO_OPERACAO)));
        CODIGO_MAQUINA = String(CODIGO_MAQUINA).replaceAll(' ', '');
        NUMERO_ODF = String(NUMERO_ODF).replaceAll(' ', '');
        if (!FUNCIONARIO || typeof FUNCIONARIO !== 'string' || !CODIGO_PECA || typeof CODIGO_PECA !== 'string' || !REVISAO || typeof REVISAO !== 'string') {
            apiResponse['message'] = 'Erro ao indentificar dados';
            return res.json(apiResponse);
        }
        const { code } = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF, NUMERO_OPERACAO: NUMERO_OPERACAO, FUNCIONARIO }, allowedCodePointed);
        apiResponse['code'] = code;
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        const codeNumberThree = [3];
        if (code === (0, message_1.message)("SetupFin")) {
            await insertsAndCodePointeds(codeNumberThree, "SetupFin", "ProdIni", 'Erro ao Iniciar produção', 'INI PROD');
        }
        else if (code === (0, message_1.message)("SetupIni")) {
            const codeNumberTwo = [2];
            await insertsAndCodePointeds(codeNumberTwo, "SetupFin", "ProdIni", "Erro ao finalizar setup", 'FIN SETUP');
            await insertsAndCodePointeds(codeNumberThree, "SetupFin", "ProdIni", "Erro ao Iniciar produção", 'INI PROD');
        }
        async function insertsAndCodePointeds(codeNumberInput, codeErrorInsert, codeCorrectInsert, msgErrorToClient, pointedCode) {
            const insertStr = await (0, insert_1.insertInto)(codeNumberInput, String(FUNCIONARIO), Number(NUMERO_ODF), String(CODIGO_PECA), String(REVISAO), String(NUMERO_OPERACAO), String(CODIGO_MAQUINA), Number(QTDE_LIB), null, null, [pointedCode], new Date().getTime(), null, null, null);
            const insertResult = await connection.query(insertStr).then((result) => result.rowsAffected);
            if (!insertResult || insertResult.length <= 0) {
                apiResponse['message'] = msgErrorToClient;
                apiResponse['code'] = (0, message_1.message)(`${codeErrorInsert}`);
                return;
            }
            apiResponse['code'] = (0, message_1.message)(`${codeCorrectInsert}`);
            return;
        }
        await connection.close();
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = ToolServiceSelectedTools;
//# sourceMappingURL=selectedTools.service.js.map