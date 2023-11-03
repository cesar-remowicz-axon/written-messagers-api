"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unravelBarcode = void 0;
const message_1 = require("./message");
async function unravelBarcode(obj) {
    if (!obj || obj["barcode"].length < 15 || obj["barcode"].length > 20) {
        return (obj["message"] = null);
    }
    const dados = {
        numOdf: String(obj["barcode"].slice(10)),
        numOper: String(obj["barcode"].slice(0, 5)),
        codMaq: String(obj["barcode"].slice(5, 10)),
    };
    if (obj["barcode"].length > 17) {
        dados["numOper"] = obj["barcode"].slice(0, 5);
        dados["codMaq"] = obj["barcode"].slice(5, 11);
        dados["numOdf"] = obj["barcode"].slice(11);
    }
    if (obj["barcode"].length <= 16) {
        dados["numOper"] = obj["barcode"].slice(0, 5);
        dados["codMaq"] = obj["barcode"].slice(5, 9);
        dados["numOdf"] = obj["barcode"].slice(9);
    }
    if (obj["barcode"].length === 19) {
        dados["numOper"] = obj["barcode"].slice(0, 5);
        dados["codMaq"] = obj["barcode"].slice(5, 12);
        dados["numOdf"] = obj["barcode"].slice(12);
    }
    obj["message"] = (0, message_1.message)("Success");
    obj["NUMERO_ODF"] = dados["numOdf"];
    obj["NUMERO_OPERACAO"] = dados["numOper"];
    obj["CODIGO_MAQUINA"] = dados["codMaq"];
    return obj;
}
exports.unravelBarcode = unravelBarcode;
//# sourceMappingURL=unravelBarcode.js.map