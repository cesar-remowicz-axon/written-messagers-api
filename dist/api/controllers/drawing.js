"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pictures_1 = require("../pictures");
const verifyCodeNote_1 = require("../utils/verifyCodeNote");
const query_1 = require("../utils/query");
const message_1 = require("../utils/message");
class Tecnical_Drawing {
    constructor() { }
    ;
    static async get(req, res) {
        const apiResponse = req.body;
        const { DESENHO_TECNICO_MOD, REVISAO, CODIGO_PECA, NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO } = apiResponse;
        const allowedCodePointed = [1, 2, 3, 4, 5, 6, 7];
        if (typeof NUMERO_OPERACAO !== 'string' || typeof NUMERO_ODF !== 'string' || typeof FUNCIONARIO !== 'string') {
            apiResponse['message'] = 'Erro ao localizar dados';
            return res.status(200).json(apiResponse);
        }
        if (DESENHO_TECNICO_MOD === 'FALSE') {
            apiResponse['message'] = (0, message_1.message)("NoModule");
            return res.status(200).json(apiResponse);
        }
        const { accepted, code } = await (0, verifyCodeNote_1.codePoint)({ NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO }, allowedCodePointed);
        if (typeof code === 'string') {
            apiResponse["code"] = code;
        }
        if (!accepted) {
            return res.status(200).json(apiResponse);
        }
        const resource = await (0, query_1.select)('drawingFindQuery', { REVISAO, CODIGO_PECA });
        const result = [];
        if (resource) {
            for await (const [i, record] of Object.entries(resource)) {
                const { NUMPEC, IMAGEM } = await record;
                const path = await pictures_1.pictures.getPicturePath(NUMPEC, IMAGEM, `_drawing`, String(i));
                result.push(path);
            }
        }
        apiResponse['result'] = result;
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = Tecnical_Drawing;
;
//# sourceMappingURL=drawing.js.map