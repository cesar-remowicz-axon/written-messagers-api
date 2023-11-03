"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForComponents = void 0;
const ipFunc_1 = require("./ipFunc");
const message_1 = require("./message");
const query_1 = require("./query");
const checkForComponents = async (obj) => {
    const childCode = [];
    const execut = [];
    const reserved = [];
    const available = [];
    const { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_PECA, FUNCIONARIO } = obj;
    const componentsResource = await (0, query_1.select)("queryToCheckForAlocatedParts", { NUMERO_ODF, NUMERO_OPERACAO }) || null;
    const ip = await (0, ipFunc_1.ipAdd)();
    obj['childCode'] = childCode;
    obj['message'] = (0, message_1.message)("Success");
    obj['insertAddressUpdate'] = [];
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
    obj['childCode'] = childCode;
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
    const addressForChildrenParts = await (0, query_1.select)('getAddressForChildrenParts', { parts: childCode.map((element) => element = `'${String(element)}'`).join(',') });
    const resourceForSaldoInChildrenParts = await (0, query_1.select)('getSaldoForChildrenParts', { parts: childCode.map((element) => element = `'${String(element)}'`).join(',') });
    const unitValue = [];
    for (let i = 0; i < childCode.length; i++) {
        obj['insertAddressUpdate'].push(`UPDATE ${process.env['MS_TABLE_CONTAINER_OF_PARTS_STORAGE']} SET SALDOREAL = SALDOREAL - ${minToProd * execut[i]} WHERE 1 = 1 AND CODIGO = '${childCode[i]}';`);
        obj['insertAddressUpdate'].push(`INSERT INTO ${process.env['MS_TABLE_CONTAINER_OF_RESERVATION']} (ODF,NUMOPE,CODIGO,CODIGO_FILHO,QUANTIDADE,ENDERECO,ALOCADO,DATAHORA,USUARIO) VALUES ('${NUMERO_ODF}', ${String(Number(obj['NUMERO_OPERACAO']))}, '${CODIGO_PECA}', '${childCode[i]}', ${minToProd * execut[i]}, 'ADDRESS', NULL, GETDATE(), '${FUNCIONARIO}');`);
        obj['insertAddressUpdate'].push(`INSERT INTO ${process.env['MS_TABLE_STORAGE_POINTED_HISTORIC']} (DATAHORA, STATUS, ODF, CODIGO_PECA, QUANTIDADE, USUARIO) VALUES(GETDATE(), 'SAIDA', '${NUMERO_ODF}', '${childCode[i]}', ${minToProd * execut[i]}, '${FUNCIONARIO}');`);
        obj['insertAddressUpdate'].push(`INSERT INTO HISREAL 
        (CODIGO, DOCUMEN, DTRECEB, QTRECEB, VALPAGO, FORMA, SALDO, DATA, LOTE, USUARIO, ODF, NOTA, LOCAL_ORIGEM, LOCAL_DESTINO, CUSTO_MEDIO, CUSTO_TOTAL, CUSTO_UNITARIO, CATEGORIA, DESCRICAO, EMPRESA_RECNO, ESTORNADO_APT_PRODUCAO, CST_ENDERECO, VERSAOSISTEMA, CST_SISTEMA, CST_HOSTNAME, CST_IP)
        SELECT CODIGO, '${NUMERO_ODF}/${childCode[i]}', GETDATE(), ${Number(minToProd * execut[i])}, 0 , 'S', ${!resourceForSaldoInChildrenParts[i] || resourceForSaldoInChildrenParts[i] === 0 || !resourceForSaldoInChildrenParts[i].SALDO ? Number(minToProd * execut[i]) : resourceForSaldoInChildrenParts[i].SALDO} - ${Number(minToProd * execut[i])}, GETDATE(), '0', '${FUNCIONARIO}', '${NUMERO_ODF}', '0', '0', '0', 0, 0, 0, '0', 'DESCRI', 1, 'E', '${addressForChildrenParts[i] ? addressForChildrenParts[i].address : ''}', 1.01, 'APONTAMENTO', '${obj['host']}', '${ip}' FROM ESTOQUE(NOLOCK) WHERE 1 = 1  AND CODIGO = '${childCode[i]}' GROUP BY CODIGO;`);
        obj['insertAddressUpdate'].push(`UPDATE CST_ESTOQUE_ENDERECOS SET QUANTIDADE = QUANTIDADE - ${Number(minToProd * execut[i])} WHERE 1 = 1 AND ENDERECO = '${addressForChildrenParts[i] ? addressForChildrenParts[i].address : ''}' AND R_E_C_N_O_ = '${addressForChildrenParts[i] ? addressForChildrenParts[i].id : ''}';`);
        unitValue.push(minToProd * execut[i]);
    }
    obj['valorUnitario'] = unitValue;
    obj['message'] = "Reservado";
    obj['childrenAddress'] = addressForChildrenParts;
    return obj;
};
exports.checkForComponents = checkForComponents;
//# sourceMappingURL=selectIfHasP.js.map