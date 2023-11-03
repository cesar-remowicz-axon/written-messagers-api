"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codePoint = void 0;
const message_1 = require("./message");
const query_1 = require("./query");
const codePoint = async (variables, acceptable) => {
    const HISAPONTA = 23;
    const { NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO } = variables;
    const response = {
        accepted: null,
        employee: FUNCIONARIO || null,
        code: null,
        time: 0,
    };
    const resource = await (0, query_1.select)(HISAPONTA, { NUMERO_ODF, NUMERO_OPERACAO });
    if (resource) {
        const { USUARIO, CAMPO1, DATAHORA, CODAPONTA, NUMOPE } = resource[0];
        if ((Number(NUMOPE) !== Number(NUMERO_OPERACAO)) && (Number(CODAPONTA) !== 6 && Number(CODAPONTA) !== 8)) {
            return response;
        }
        response['time'] = DATAHORA;
        response['code'] = CAMPO1;
        if (FUNCIONARIO !== USUARIO) {
            response['employee'] = USUARIO;
        }
        acceptable.forEach(acc => {
            if (Number(CODAPONTA) === acc) {
                response['accepted'] = (0, message_1.message)("Success");
            }
        });
    }
    else {
        response['accepted'] = (0, message_1.message)("Success");
    }
    return response;
};
exports.codePoint = codePoint;
//# sourceMappingURL=verifyCodeNote.js.map