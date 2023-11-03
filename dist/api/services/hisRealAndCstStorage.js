"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertHisrealAndCstStorage = void 0;
const global_config_1 = require("../../global.config");
const query_1 = require("../services/query");
const message_1 = require("./message");
const mssql_1 = __importDefault(require("mssql"));
const insertHisrealAndCstStorage = async (QTDE_LIB, address, codigoPeca, NUMERO_ODF, goodFeed, FUNCIONARIO, hostname, ip, codigoFilho, NUMERO_OPERACAO, operation, moduleAddress) => {
    const strQuery = [];
    try {
        if (!NUMERO_ODF) {
            return null;
        }
        const values = {
            address: address,
            partCode: codigoPeca,
            quantityToProduce: QTDE_LIB,
            NUMERO_ODF: NUMERO_ODF,
        };
        const resource = await (0, query_1.select)(29, values);
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        if (operation === true) {
            strQuery.push(`
            INSERT INTO HISREAL
            (CODIGO, DOCUMEN, DTRECEB, QTRECEB, VALPAGO, FORMA, SALDO, DATA, LOTE, USUARIO, ODF, NOTA, LOCAL_ORIGEM, LOCAL_DESTINO, CUSTO_MEDIO, CUSTO_TOTAL, CUSTO_UNITARIO, CATEGORIA, DESCRICAO, EMPRESA_RECNO, ESTORNADO_APT_PRODUCAO, CST_ENDERECO, VERSAOSISTEMA, CST_SISTEMA,CST_HOSTNAME,CST_IP) 
            SELECT 
                CODIGO, '${NUMERO_ODF}/${codigoPeca}', GETDATE(), ${goodFeed}, 0 , 'E', ${!resource || resource[0] === 0 || !resource[0].SALDO ? goodFeed : resource[0].SALDO} + ${goodFeed}, GETDATE(), '0', '${FUNCIONARIO}', '${NUMERO_ODF}', '0', '0', '0', 0, 0, 0, '0', 'DESCRI', 1, 'E', '${address}', 1.00, 'APONTAMENTO', '${hostname}', '${ip}'
            FROM ESTOQUE(NOLOCK) WHERE 1 = 1  AND CODIGO = '${codigoPeca}'  GROUP BY CODIGO
            `);
            strQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${goodFeed} WHERE 1 = 1 AND CODIGO = '${codigoPeca}'`);
        }
        try {
            if (moduleAddress === true) {
                if (operation === true) {
                    const x = [];
                    x.push(`UPDATE CST_ESTOQUE_ENDERECOS SET QUANTIDADE = COALESCE(QUANTIDADE, 0) + ${goodFeed}, DATAHORA = GETDATE(), ODF = '${NUMERO_ODF}', ENDERECO = '${address}' WHERE 1 = 1 AND CODIGO = '${codigoPeca}' `);
                    const z = await connection.query(x.join('\n')).then(result => result.rowsAffected);
                    if (!z || z.length <= 0 || z[0] === 0) {
                        strQuery.push(`INSERT INTO CST_ESTOQUE_ENDERECOS (CODIGO, ENDERECO, QUANTIDADE, ODF, DATAHORA) VALUES ('${codigoPeca}',  '${address}',  ${goodFeed}, '${NUMERO_ODF}', GETDATE())`);
                    }
                }
                else {
                    const x = [];
                    x.push(`UPDATE CST_ESTOQUE_ENDERECOS SET QUANTIDADE = COALESCE(QUANTIDADE, 0) + 0, DATAHORA = GETDATE(), ODF = '${values.NUMERO_ODF}', ENDERECO = '${values.address}' WHERE 1 = 1 AND CODIGO = '${codigoPeca}' `);
                    const z = await connection.query(x.join('\n')).then(result => result.rowsAffected);
                    if (!z || z.length <= 0 || z[0] === 0) {
                        strQuery.push(`INSERT INTO CST_ESTOQUE_ENDERECOS (CODIGO, ENDERECO, QUANTIDADE, ODF, DATAHORA) VALUES ('${codigoPeca}',  '${address}',  0, '${NUMERO_ODF}', GETDATE())`);
                    }
                }
            }
        }
        catch (error) {
            console.log("Error on CST_ESTOQUE_ENDERECOS", error);
            return null;
        }
        if (moduleAddress === true) {
            if (!codigoFilho || codigoFilho.length <= 0) {
                strQuery.push(`INSERT INTO HISTORICO_ENDERECO (
                    DATAHORA, 
                    ODF, 
                    QUANTIDADE, 
                    CODIGO_PECA, 
                    CODIGO_FILHO, 
                    ENDERECO_ATUAL, 
                    STATUS, 
                    NUMERO_OPERACAO) 
                    VALUES (
                    GETDATE(),
                    '${NUMERO_ODF}', 
                    ${goodFeed}, 
                    ${codigoPeca}, 
                    null, 
                    '${address}', 
                    'APONTADO', 
                    '${NUMERO_OPERACAO}'
                    )`);
            }
            else {
                codigoFilho.split(',').forEach((element) => {
                    strQuery.push(`INSERT INTO HISTORICO_ENDERECO (
                        DATAHORA, 
                        ODF, 
                        QUANTIDADE, 
                        CODIGO_PECA, 
                        CODIGO_FILHO, 
                        ENDERECO_ATUAL, 
                        STATUS, 
                        NUMERO_OPERACAO) 
                        VALUES (
                        GETDATE(),
                        '${NUMERO_ODF}', 
                        ${goodFeed}, 
                        ${codigoPeca}, 
                        ${element}, 
                        '${address}', 
                        'APONTADO', 
                        '${NUMERO_OPERACAO}'
                        )`);
                });
            }
        }
        await connection.query(strQuery.join('\n')).then(result => result.rowsAffected);
        return (0, message_1.message)("Success");
    }
    catch (error) {
        console.log('Error on insertHisrealAndCstEstoque ', error);
        return null;
    }
};
exports.insertHisrealAndCstStorage = insertHisrealAndCstStorage;
//# sourceMappingURL=hisRealAndCstStorage.js.map