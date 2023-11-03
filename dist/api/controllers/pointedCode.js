"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyCodeNote_1 = require("../utils/verifyCodeNote");
class Pointed {
    constructor() { }
    ;
    static async code(req, res) {
        const apiResponse = req.body;
        const { NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO } = apiResponse;
        const allowedCodePointed = [4, 5];
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO }, allowedCodePointed);
        const { code } = hisaponta;
        apiResponse["code"] = code;
        return res.status(200).json(apiResponse);
    }
}
exports.default = Pointed;
//# sourceMappingURL=pointedCode.js.map