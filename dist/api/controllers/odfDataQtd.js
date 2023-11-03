"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.odfDataQtd = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const select_1 = require("../services/select");
const decryptedOdf_1 = require("../utils/decryptedOdf");
const encryptOdf_1 = require("../utils/encryptOdf");
const odfIndex_1 = require("../utils/odfIndex");
const queryGroup_1 = require("../utils/queryGroup");
const odfDataQtd = async (req, res) => {
    console.log("linha 10 /ODFDATAQTD/ ");
    let numeroOdf = (0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies["NUMERO_ODF"]))) || null;
    numeroOdf = Number(numeroOdf);
    let numOper = (0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies["NUMERO_OPERACAO"]))) || null;
    let numOpeNew = String(numOper.toString().replaceAll(' ', "0")) || null;
    const funcionario = (0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies['FUNCIONARIO']))) || null;
    const lookForOdfData = `SELECT * FROM VW_APP_APTO_PROGRAMACAO_PRODUCAO (NOLOCK) WHERE 1 = 1 AND NUMERO_ODF = ${numeroOdf} AND CODIGO_PECA IS NOT NULL ORDER BY NUMERO_OPERACAO ASC`;
    let response = {
        message: '',
        quantityOdf: '',
        valuePointedBefore: '',
        maxValueProd: '',
    };
    try {
        const data = await (0, select_1.select)(lookForOdfData);
        res.cookie("qtdProduzir", (0, encryptOdf_1.encrypted)(data[0].QTDE_ODF));
        let indexOdf = await (0, odfIndex_1.odfIndex)(data, numOper);
        const selectedItens = await (0, queryGroup_1.selectedItensFromOdf)(data, indexOdf);
        console.log("linha 28", indexOdf);
        console.log("linha 31", selectedItens.odf);
        res.cookie("QTD_REFUGO", selectedItens.odf.QTD_REFUGO);
        const obj = {
            funcionario: funcionario,
            odfSelecionada: selectedItens.odf,
            valorMaxdeProducao: selectedItens.odf.QTDE_APONTADA,
        };
        console.log("linha 75", obj);
        if (!obj.odfSelecionada) {
            return res.json({ message: 'erro ao pegar o tempo' });
        }
        else {
            return res.status(200).json(obj);
        }
    }
    catch (error) {
        console.log(error);
        return res.json({ message: "erro ao pegar o tempo" });
    }
};
exports.odfDataQtd = odfDataQtd;
//# sourceMappingURL=odfDataQtd.js.map