"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBagde = void 0;
const select_1 = require("../services/select");
const encryptOdf_1 = require("../utils/encryptOdf");
const sanitize_1 = require("../utils/sanitize");
const searchBagde = async (req, res) => {
    let matricula = String((0, sanitize_1.sanitize)(req.body["cracha"])) || null;
    let start = new Date() || 0;
    if (!matricula || matricula === '') {
        return res.json({ message: "codigo de matricula vazia" });
    }
    try {
        let lookForBadge = `SELECT TOP 1 [MATRIC], [FUNCIONARIO], [CRACHA] FROM FUNCIONARIOS WHERE 1 = 1 AND [CRACHA] = '${matricula}' ORDER BY FUNCIONARIO`;
        const selecionarMatricula = await (0, select_1.select)(lookForBadge);
        if (selecionarMatricula.length > 0) {
            const strStartTime = (0, encryptOdf_1.encrypted)(String(start.getTime()));
            const encryptedEmployee = (0, encryptOdf_1.encrypted)(String(selecionarMatricula[0].FUNCIONARIO));
            const encryptedBadge = (0, encryptOdf_1.encrypted)(String(selecionarMatricula[0].CRACHA));
            res.cookie("starterBarcode", strStartTime);
            res.cookie("FUNCIONARIO", encryptedEmployee);
            res.cookie("CRACHA", encryptedBadge);
            return res.json({ message: 'cracha encontrado' });
        }
        else {
            return res.json({ message: 'cracha não encontrado' });
        }
    }
    catch (error) {
        console.log(error);
        return res.json({ message: 'erro ao tentar localizar cracha' });
    }
    finally {
    }
};
exports.searchBagde = searchBagde;
//# sourceMappingURL=pointBagde.js.map