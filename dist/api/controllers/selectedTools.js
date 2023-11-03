"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectedTools = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const insert_1 = require("../services/insert");
const decryptedOdf_1 = require("../utils/decryptedOdf");
const encryptOdf_1 = require("../utils/encryptOdf");
const selectedTools = async (req, res) => {
    const numeroOdf = Number((0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies['NUMERO_ODF'])))) || 0;
    const numeroOperacao = (0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies['NUMERO_OPERACAO']))) || null;
    const codigoMaq = (0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies['CODIGO_MAQUINA']))) || null;
    const codigoPeca = (0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies["CODIGO_PECA"]))) || null;
    const funcionario = (0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies['employee']))) || null;
    const revisao = (0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies['REVISAO']))) || null;
    const qtdLibMax = Number((0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies['qtdLibMax'])))) || 0;
    const boas = 0;
    const ruins = 0;
    const codAponta = 2;
    const codAponta3 = 3;
    const descricaoCodigoAponta = 'Fin Setup.';
    const descricaoCodigoAponta3 = 'Ini Prod.';
    const faltante = 0;
    const retrabalhada = 0;
    const motivo = String('' || null);
    const tempoDecorrido = Number(Number(new Date().getTime()) || 0 - Number(Number(new Date().getTime()) || 0 - Number((0, decryptedOdf_1.decrypted)(String((0, sanitize_html_1.default)(req.cookies['startSetupTime']))))) || 0);
    res.cookie("startProd", (0, encryptOdf_1.encrypted)(Number(new Date().getTime() || 0)));
    try {
        const codApontamentoFinalSetup = await (0, insert_1.insertInto)(funcionario, numeroOdf, codigoPeca, revisao, numeroOperacao, codigoMaq, qtdLibMax, boas, ruins, codAponta, descricaoCodigoAponta, motivo, faltante, retrabalhada, tempoDecorrido);
        console.log("linha 107", codApontamentoFinalSetup);
        if (codApontamentoFinalSetup === 'Algo deu errado') {
            return res.json({ message: 'Algo deu errado' });
        }
        else {
            try {
                const codApontamentoInicioSetup = await (0, insert_1.insertInto)(funcionario, numeroOdf, codigoPeca, revisao, numeroOperacao, codigoMaq, qtdLibMax, boas, ruins, codAponta3, descricaoCodigoAponta3, motivo, faltante, retrabalhada, Number(new Date().getTime() || 0));
                console.log("linha 42 ", codApontamentoInicioSetup);
                if (codApontamentoInicioSetup === 'Algo deu errado') {
                    return res.json({ message: 'Algo deu errado' });
                }
                else if (codApontamentoInicioSetup === 'insert done') {
                    return res.json({ message: 'ferramentas selecionadas com successo' });
                }
                else {
                    return res.json({ message: 'Algo deu errado' });
                }
            }
            catch (error) {
                return res.json({ message: 'Algo deu errado' });
            }
        }
    }
    catch (error) {
        return res.json({ message: 'Algo deu errado' });
    }
};
exports.selectedTools = selectedTools;
//# sourceMappingURL=selectedTools.js.map