"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertIntoNewOrder = void 0;
const insertIntoNewOrder = async (chosenOption, NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_ODF, released, totalValue, badFeed, valorFeed, reworkFeed, missingFeed, CODIGO_PECA, CODIGO_CLIENTE, FUNCIONARIO, REVISAO) => {
    const codes = {
        0: `INSERT INTO NOVA_ORDEM (NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_ODF, QTDE_LIB, QTDE_APONTADA, QTD_REFUGO, QTD_BOAS, QTD_RETRABALHADA, QTD_FALTANTE, CODIGO_PECA, CODIGO_CLIENTE, USUARIO, REVISAO) VALUES('${NUMERO_ODF}', '${NUMERO_OPERACAO}', '${CODIGO_MAQUINA}', ${QTDE_ODF}, ${released},${totalValue}, ${badFeed || null}, ${valorFeed || null},  ${reworkFeed || null}, ${missingFeed || null}, '${CODIGO_PECA}', '${CODIGO_CLIENTE}', '${FUNCIONARIO}', '${REVISAO}')`,
    };
    return codes[String(chosenOption)];
};
exports.insertIntoNewOrder = insertIntoNewOrder;
//# sourceMappingURL=insertNewOrder.js.map