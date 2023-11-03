"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectAddress = void 0;
const message_1 = require("./message");
const query_1 = require("./query");
const selectAddress = async (codigoMaq, CODIGO_PECA, REVISAO, totalValue) => {
    try {
        let part;
        let data;
        if (codigoMaq !== 'SLDO2' || codigoMaq !== 'SLD01') {
            part = await (0, query_1.select)(3, { CODIGO_PECA, REVISAO });
        }
        if (codigoMaq !== 'EX002') {
            data = await (0, query_1.select)(37, { CODIGO_PECA, maxWidth: part[0].LARGURA || 0, maxSize: part[0].COMPRIMENTO || 0, maxWeight: part[0].EXECUT || 0 * totalValue, percen: 5 });
        }
        else if (codigoMaq === 'EX002') {
            data = await (0, query_1.select)(37, { CODIGO_PECA, maxWidth: part[0].LARGURA || 0, maxSize: part[0].COMPRIMENTO || 0, maxWeight: part[0].EXECUT || 0 * totalValue, percen: 7 });
        }
        if (!data) {
            return (0, message_1.message)(46);
        }
        return data;
    }
    catch (err) {
        console.log('err in select address ', err);
        return null;
    }
};
exports.selectAddress = selectAddress;
//# sourceMappingURL=selectAddress.js.map