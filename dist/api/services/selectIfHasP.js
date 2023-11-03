"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForComponents = void 0;
const message_1 = require("./message");
const query_1 = require("./query");
const checkForComponents = async (obj) => {
    const childCode = [];
    const execut = [];
    const reserved = [];
    const available = [];
    const { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_PECA, FUNCIONARIO } = obj;
    const ALOCACAO_POINT = 22;
    const componentsResource = await (0, query_1.select)(ALOCACAO_POINT, { NUMERO_ODF, NUMERO_OPERACAO }) || null;
    obj['message'] = (0, message_1.message)("Success") || 'Success';
    obj['insertAddressUpdate'] = [""];
    if (!componentsResource || Object.entries(componentsResource[0]).length <= 0) {
        return obj;
    }
    for (let i = 0; i < Object.entries(componentsResource).length; i++) {
        const iterator = componentsResource[i];
        execut.push(Number(iterator['EXECUT']));
        reserved.push(iterator['RESERVADO']);
        childCode.push(iterator['NUMITE']);
        available.push(Math.floor(Number(iterator['SALDOREAL']) / Number(iterator['EXECUT']) ? Number(iterator['SALDOREAL']) / Number(iterator['EXECUT']) : 0));
    }
    const reservMin = Number(Math.min(...reserved));
    const qtdLibToProd = Math.floor(Math.min(...available));
    obj['valorUnitario'] = [];
    obj['execut'] = execut;
    obj['childCode'] = childCode || [''];
    obj['condic'] = componentsResource[0]['CONDIC'] || '';
    obj['quantidade'] = obj['QTDE_LIB'] || 0;
    obj['valorApontado'] = obj['QTDE_LIB'] || 0;
    if (reservMin && reservMin > 0) {
        obj['QTDE_LIB'] = Math.min(...reserved);
        obj['quantidade'] = Math.min(...reserved);
        return obj;
    }
    if (!qtdLibToProd || qtdLibToProd < 1 || qtdLibToProd === Infinity || Number.isNaN(qtdLibToProd)) {
        const partWithoutQty = [];
        for (let i = 0; i < available.length; i++) {
            if (available[i] < 1 || available[i] === Infinity || !available[i] || Number.isNaN(available[i])) {
                partWithoutQty.push(String(childCode[i]));
            }
        }
        obj['semLimite'] = partWithoutQty.join(', ');
        obj['QTDE_LIB'] = qtdLibToProd;
        obj['quantidade'] = qtdLibToProd;
        obj['message'] = (0, message_1.message)("NoLimit") || `Não há quantidade disponível para apontar`;
        return obj;
    }
    const minToProd = qtdLibToProd < Number(obj['QTDE_LIB']) ? qtdLibToProd : Number(obj['QTDE_LIB']);
    obj['QTDE_LIB'] = minToProd;
    obj['quantidade'] = obj['QTDE_LIB'];
    const unitValue = [];
    for (let i = 0; i < childCode.length; i++) {
        obj['insertAddressUpdate'].push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL - ${minToProd * execut[i]} WHERE 1 = 1 AND CODIGO = '${childCode[i]}'`);
        obj['insertAddressUpdate'].push(`INSERT INTO ALOCACAO_POINT (ODF, NUMOPE, CODIGO, CODIGO_FILHO, QUANTIDADE, ENDERECO, ALOCADO, DATAHORA, USUARIO) VALUES ('${NUMERO_ODF}', ${String(String(obj['NUMERO_OPERACAO']).replaceAll(' ', '')).replaceAll('000', '')}, '${CODIGO_PECA}', '${childCode[i]}', ${minToProd * execut[i]}, 'ADDRESS', NULL, GETDATE(), '${FUNCIONARIO}')`);
        obj['insertAddressUpdate'].push(`INSERT INTO HISTORICO_ESTOQUE_POINT (DATAHORA, STATUS, ODF, CODIGO_PECA, QUANTIDADE, USUARIO) VALUES(GETDATE(), 'SAIDA', '${NUMERO_ODF}', '${childCode[i]}', ${minToProd * execut[i]}, '${FUNCIONARIO}')`);
        unitValue.push(minToProd * execut[i]);
    }
    obj['valorUnitario'] = unitValue;
    obj['message'] = "Reservado";
    return obj;
};
exports.checkForComponents = checkForComponents;
//# sourceMappingURL=selectIfHasP.js.map