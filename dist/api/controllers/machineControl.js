"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const queryConnector_1 = require("../../queryConnector");
const message_1 = require("../services/message");
const insert_1 = require("../services/insert");
const query_1 = require("../services/query");
class Machine {
    static async control(req, res) {
        const apiResponse = req.body;
        const { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, supervisor, MOTIVOS_MOD, SUPERVISOR_MOD, FUNCIONARIO, CODIGO_PECA, REVISAO, QTDE_LIB } = apiResponse;
        const allowedCodePointed = [3, 7];
        const returnProduction = [3];
        const machineStop = [7];
        if (typeof MOTIVOS_MOD !== 'string' || MOTIVOS_MOD === 'FALSE') {
            apiResponse['message'] = (0, message_1.message)("NoModule");
            ;
            return res.status(200).json(apiResponse);
        }
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF, NUMERO_OPERACAO: Number(NUMERO_OPERACAO), CODIGO_MAQUINA }, allowedCodePointed);
        const { code, accepted } = hisaponta;
        if (typeof code === 'string') {
            apiResponse["code"] = code;
        }
        else {
            apiResponse['message'] = 'Não é possível controlar a máquina';
            return res.status(200).json(apiResponse);
        }
        if (!accepted) {
            apiResponse['message'] = 'Não é possível controlar a máquina';
            return res.status(200).json(apiResponse);
        }
        if (SUPERVISOR_MOD && typeof SUPERVISOR_MOD === 'string') {
            if (SUPERVISOR_MOD === 'TRUE') {
                const VIEW_GRUPO_APT = 10;
                const resource = await (0, query_1.select)(VIEW_GRUPO_APT, { supervisor });
                if (!resource) {
                    apiResponse['message'] = (0, message_1.message)("Nobadge");
                    return res.status(200).json(apiResponse);
                }
                for (const [key, value] of Object.entries(resource[0])) {
                    apiResponse[key] = value;
                }
            }
        }
        if (code === (0, message_1.message)("ProdIni")) {
            const insertSeven = await (0, insert_1.istInto)(machineStop, FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, null, null, ['STOPPED'], 0, null, null, null);
            const conn = await (0, queryConnector_1.poolConnection)();
            const resultOfInsertSeven = await conn.request().query(insertSeven).then((result) => result.rowsAffected);
            if (!resultOfInsertSeven || resultOfInsertSeven.length <= 0 || resultOfInsertSeven[0] === 0) {
                return res.status(200).json(apiResponse);
            }
            apiResponse['message'] = (0, message_1.message)("Stopped");
            apiResponse["code"] = (0, message_1.message)("Stopped");
        }
        else if (code === (0, message_1.message)("Stopped")) {
            const insertThree = await (0, insert_1.istInto)(returnProduction, FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, null, null, [`INI PROD`], new Date().getTime(), null, null, null);
            const conn = await (0, queryConnector_1.poolConnection)();
            const resultOfInsertThree = await conn.request().query(insertThree).then((result) => result.rowsAffected);
            if (!resultOfInsertThree || resultOfInsertThree.length <= 0 || resultOfInsertThree[0] === 0) {
                return res.status(200).json(apiResponse);
            }
            apiResponse['message'] = (0, message_1.message)("ProdIni");
            apiResponse["code"] = (0, message_1.message)("ProdIni");
        }
        else {
            apiResponse['message'] = 'Não é possível controlar a máquina';
        }
        return res.status(200).json(apiResponse);
    }
}
exports.default = Machine;
;
//# sourceMappingURL=machineControl.js.map