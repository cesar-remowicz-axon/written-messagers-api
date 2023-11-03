"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEstoqueAlocadoHist = void 0;
const global_config_1 = require("../../global.config");
const message_1 = require("./message");
const mssql_1 = __importDefault(require("mssql"));
const updateEstoqueAlocadoHist = async (totalValue, qtdLib, CODIGO_PECA, NUMERO_OPERACAO, execut, NUMERO_ODF, childCode, address, addressModule, estoqueModule) => {
    if (!childCode) {
        return { message: (0, message_1.message)(0) };
    }
    const array = [];
    childCode.split(',').forEach(async (codigoFilho, i) => {
        if (totalValue < qtdLib) {
            if (addressModule === true) {
                array.push(`INSERT INTO HISTORICO_ENDERECO (DATAHORA, ODF, QUANTIDADE, CODIGO_PECA, CODIGO_FILHO, ENDERECO_ATUAL, STATUS, NUMERO_OPERACAO) VALUES (GETDATE(), '${NUMERO_ODF}', ${totalValue} ,'${CODIGO_PECA}', '${codigoFilho || 'S/I'}', '${!address ? null : address}', 'DEVOLUÇÃO', '${NUMERO_OPERACAO}')`);
            }
            if (estoqueModule === true) {
                array.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${(Number(execut.split(',')[i]) * qtdLib) - (totalValue * Number(execut.split(',')[i]))} WHERE 1 = 1 AND CODIGO = '${codigoFilho}'`);
            }
        }
        if (estoqueModule === true) {
            array.push(`DELETE CST_ALOCACAO WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' AND CODIGO_FILHO = '${codigoFilho}'`);
        }
        if (addressModule === true) {
            array.push(`INSERT INTO HISTORICO_ENDERECO (DATAHORA, ODF, QUANTIDADE, CODIGO_PECA, CODIGO_FILHO, ENDERECO_ATUAL, STATUS, NUMERO_OPERACAO) VALUES (GETDATE(), '${NUMERO_ODF}', ${totalValue} ,'${CODIGO_PECA}', '${codigoFilho || 'S/I'}', '${!address ? null : address}', 'APONTADO', '${NUMERO_OPERACAO}')`);
        }
    });
    try {
        if (array.length > 0) {
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            await connection.query(array.join('\n')).then(result => result.rowsAffected);
        }
        return (0, message_1.message)('Success');
    }
    catch (error) {
        console.log('linha 32  - valuesFromChildren.ts - ', error);
        return null;
    }
};
exports.updateEstoqueAlocadoHist = updateEstoqueAlocadoHist;
//# sourceMappingURL=valuesFromChildren.js.map