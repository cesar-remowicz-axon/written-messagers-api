"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryConnector_1 = require("../../queryConnector");
const verifyCodeNote_1 = require("../utils/verifyCodeNote");
const insert_1 = require("../utils/insert");
const message_1 = require("../utils/message");
const query_1 = require("../utils/query");
class Machine {
    constructor() { }
    ;
    static async control(req, res) {
        const apiResponse = req.body;
        const { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, supervisor, MOTIVOS_MOD, SUPERVISOR_MOD, FUNCIONARIO, CODIGO_PECA, REVISAO, QTDE_LIB } = apiResponse;
        const allowedCodePointed = [3, 7];
        const returnProductionCode = [3];
        const machineStopCode = [7];
        const regExPattern = /^0+$/;
        if (MOTIVOS_MOD === 'FALSE') {
            apiResponse['message'] = (0, message_1.message)("NoModule");
            ;
            return res.status(200).json(apiResponse);
        }
        const { code, accepted } = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO }, allowedCodePointed);
        if (typeof code === 'string') {
            apiResponse["code"] = code;
        }
        ;
        if (!accepted) {
            apiResponse['message'] = 'Não é possível parar ou reiniciar a produção';
            return res.status(200).json(apiResponse);
        }
        if (SUPERVISOR_MOD === 'TRUE') {
            if (!supervisor || regExPattern.test(supervisor)) {
                apiResponse['message'] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            const resource = await (0, query_1.select)('tableOfSupervisors', { supervisor });
            if (!resource) {
                apiResponse['message'] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            for (const [key, value] of Object.entries(resource[0])) {
                apiResponse[key] = value;
            }
        }
        async function inserFunc(checkIfMotive, strInsert, pointCodeInsert) {
            const { selectedMotive } = apiResponse;
            if (checkIfMotive) {
                if (!selectedMotive || selectedMotive === 'null' || selectedMotive.includes('Selec')) {
                    apiResponse['message'] = 'Motivo não identificado';
                    return;
                }
            }
            const str = await (0, insert_1.insertInto)(pointCodeInsert, FUNCIONARIO, NUMERO_ODF, CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_LIB, null, null, [`${strInsert}`], 0, selectedMotive, null, null);
            const conn = await (0, queryConnector_1.poolConnection)();
            const result = await conn.request().query(str).then((result) => result.rowsAffected);
            if (!result || result.length <= 0 || result[0] === 0) {
                return res.status(200).json(apiResponse);
            }
            apiResponse["code"] = strInsert;
            return;
        }
        if (code === (0, message_1.message)("ProdIni")) {
            await inserFunc(true, "STOPPED", machineStopCode);
        }
        else if (code === (0, message_1.message)("Stopped")) {
            await inserFunc(false, "INI PROD", returnProductionCode);
        }
        else {
            apiResponse['message'] = 'Não é possível controlar a máquina';
        }
        return res.status(200).json(apiResponse);
    }
}
exports.default = Machine;
;
//# sourceMappingURL=machine.js.map