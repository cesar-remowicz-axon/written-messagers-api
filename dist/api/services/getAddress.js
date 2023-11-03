"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = void 0;
const query_1 = require("./query");
const getAddress = async (REVISAO, codMaq, totalValue, parts) => {
    try {
        let result = [];
        for (let i = 0; i < parts?.length; i++) {
            let dimensionsFatherComponents = await (0, query_1.select)(3, { CODIGO_PECA: parts[i], REVISAO: REVISAO });
            let selectData;
            if (codMaq === 'EX002') {
                selectData = await (0, query_1.select)(37, {
                    CODIGO_PECA: parts[i],
                    maxWidth: !dimensionsFatherComponents[0] ? 0 : dimensionsFatherComponents[0].LARGURA * totalValue,
                    maxSize: !dimensionsFatherComponents[0] ? 0 : dimensionsFatherComponents[0].COMPRIMENTO,
                    maxWeight: !dimensionsFatherComponents[0] ? 0 : dimensionsFatherComponents[0].EXECUT,
                    percen: 7
                });
            }
            else {
                selectData = await (0, query_1.select)(37, {
                    CODIGO_PECA: parts[i],
                    maxWidth: !dimensionsFatherComponents[0] ? 0 : dimensionsFatherComponents[0].LARGURA * totalValue,
                    maxSize: !dimensionsFatherComponents[0] ? 0 : dimensionsFatherComponents[0].COMPRIMENTO,
                    maxWeight: !dimensionsFatherComponents[0] ? 0 : dimensionsFatherComponents[0].EXECUT,
                    percen: 5
                });
            }
            result.push(selectData[0]['ENDERECO']);
        }
        return result;
    }
    catch (err) {
        console.log('err in select address ', err);
        return null;
    }
};
exports.getAddress = getAddress;
//# sourceMappingURL=getAddress.js.map