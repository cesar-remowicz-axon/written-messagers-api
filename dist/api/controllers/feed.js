"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feed = void 0;
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const global_config_1 = require("../../global.config");
const message_1 = require("../services/message");
const insert_1 = require("../services/insert");
const query_1 = require("../services/query");
const pictures_1 = require("../pictures");
const mssql_1 = __importDefault(require("mssql"));
async function feed(req, res) {
    const codeNumberThree = 3;
    const VW_FEED_ODF = 42;
    const result = [];
    const apiResponse = req.body || null;
    const { NUMERO_ODF, FUNCIONARIO, CODIGO_PECA, CODIGO_MAQUINA, REVISAO, NUMERO_OPERACAO, QTDE_LIB, supervisor, SUPERVISOR_MOD, DESENHO_TECNICO_MOD } = apiResponse;
    const allowedCodePointed = [2, 3, 4, 5, 6, 7];
    const hisaponta = await (0, verifyCodeNote_1.codePoint)({
        NUMERO_ODF,
        NUMERO_OPERACAO: Number(NUMERO_OPERACAO),
        CODIGO_MAQUINA
    }, allowedCodePointed);
    const { code, accepted, time } = hisaponta;
    if (!accepted) {
        return res.status(200).json(apiResponse);
    }
    apiResponse["code"] = code;
    if (code === (0, message_1.message)('SetupFin')) {
        const insertThree = await (0, insert_1.istInto)([codeNumberThree], FUNCIONARIO, Number(NUMERO_ODF), String(CODIGO_PECA), String(REVISAO), String(NUMERO_OPERACAO), String(CODIGO_MAQUINA), Number(QTDE_LIB), null, null, ['INI PROD'], new Date().getTime(), null, null, null);
        apiResponse['code'] = (0, message_1.message)("ProdIni");
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        const insertThreeResult = await connection.query(`${insertThree}`).then((result) => result.rowsAffected);
        if (!insertThreeResult || insertThreeResult.length <= 0 || insertThreeResult[0] === 0) {
            apiResponse['code'] = (0, message_1.message)("SetupFin");
            apiResponse['message'] = "Erro ao Iniciar produção";
        }
    }
    const resource = await (0, query_1.select)(VW_FEED_ODF, {
        NUMERO_ODF,
        NUMERO_OPERACAO: String(NUMERO_OPERACAO.replaceAll(' ', '')),
        CODIGO_MAQUINA,
        REVISAO,
        CODIGO_PECA
    });
    if (!resource) {
        apiResponse["message"] = (0, message_1.message)("ReqError");
        return res.status(200).json(apiResponse);
    }
    if (DESENHO_TECNICO_MOD === 'TRUE') {
        for await (const [i, record] of Object.entries(resource)) {
            const { NUMPEC, IMAGEM } = await record;
            const path = await pictures_1.pictures.getPicturePath(NUMPEC, IMAGEM, '_status', String(i));
            result.push(path);
        }
        resource[0]['IMAGEM'] = result;
    }
    resource[0]['FUNCIONARIO'] = FUNCIONARIO;
    resource[0]['EXECUT'] =
        Number(resource[0]['EXECUT'] * QTDE_LIB * 1000 - (Number(new Date().getTime() - time))) || 0;
    if (SUPERVISOR_MOD === 'TRUE') {
        if (supervisor) {
            resource[0]['VERIFICADO'] = true;
        }
    }
    for (const [key, value] of Object.entries(resource[0])) {
        apiResponse[key] = value;
    }
    return res.status(200).json(apiResponse);
}
exports.feed = feed;
//# sourceMappingURL=feed.js.map