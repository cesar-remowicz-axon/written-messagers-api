"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenciamentoView = void 0;
const message_1 = require("./message");
const query_1 = require("./query");
const sequenciamentoView = async (codMaq) => {
    const data = await (0, query_1.select)(32, codMaq);
    if (codMaq !== data.data[0].CODIGO_MAQUINA) {
        return { data, message: (0, message_1.message)(33), machine: data.data[0].CODIGO_MAQUINA };
    }
    else {
        return { data, message: (0, message_1.message)(1) };
    }
};
exports.sequenciamentoView = sequenciamentoView;
//# sourceMappingURL=sequenciamento.js.map