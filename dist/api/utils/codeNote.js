"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeNote = void 0;
const message_1 = require("../services/message");
const codeNote = async (obj) => {
    var response = {
        employee: '',
        code: '',
        time: 0,
    };
    const codigoDeApontamento = await selectQuery(23, obj);
    if (codigoDeApontamento.length > 0) {
        response.time = codigoDeApontamento[0].DATAHORA;
        if (obj.employee !== codigoDeApontamento[0].USUARIO && codigoDeApontamento[0].CODAPONTA === 4) {
            response.employee = codigoDeApontamento[0].USUARIO;
        }
        const codes = {
            0: 'Error',
            1: 'Pointed Iniciated',
            2: 'Fin Setup',
            3: 'Ini Prod',
            4: 'Pointed',
            5: 'Rip iniciated',
            6: 'Begin new process',
            7: 'Machine has stopped',
            8: 'A value was returned',
        };
        obj.number.forEach((element) => {
            Object.entries(codes).map((acc) => {
                if (Number(element) === Number(acc[0])) {
                    response.code = acc[1];
                }
            });
        });
        return response;
    }
    else if (codigoDeApontamento.length <= 0) {
        response.message = (0, message_1.message)(24);
        return response;
    }
    else {
        response.message = (0, message_1.message)(0);
        return response;
    }
};
exports.codeNote = codeNote;
//# sourceMappingURL=codeNote.js.map