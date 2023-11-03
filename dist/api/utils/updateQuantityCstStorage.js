"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertHisrealAndCstEstoque = void 0;
const global_config_1 = require("../../global.config");
const message_1 = require("../services/message");
const update_1 = require("../services/update");
const query_1 = require("../services/query");
const mssql_1 = __importDefault(require("mssql"));
const insertHisrealAndCstEstoque = async (QTDE_LIB, address, codigoPeca, NUMERO_ODF, goodFeed, FUNCIONARIO, hostname, ip, codigoFilho) => {
    const values = {
        address: address,
        partCode: codigoPeca,
        quantityToProduce: QTDE_LIB,
    };
    const resultQuery = await (0, query_1.select)(29, values);
    const queryArray = [];
    const string = `INSERT INTO HISREAL
            (CODIGO, DOCUMEN, DTRECEB, QTRECEB, VALPAGO, FORMA, SALDO, DATA, LOTE, USUARIO, ODF, NOTA, LOCAL_ORIGEM, LOCAL_DESTINO, CUSTO_MEDIO, CUSTO_TOTAL, CUSTO_UNITARIO, CATEGORIA, DESCRICAO, EMPRESA_RECNO, ESTORNADO_APT_PRODUCAO, CST_ENDERECO, VERSAOSISTEMA, CST_SISTEMA,CST_HOSTNAME,CST_IP) 
        SELECT 
            CODIGO, '${NUMERO_ODF}/${codigoPeca}', GETDATE(), ${goodFeed}, 0 , 'E', ${resultQuery.length <= 0 || resultQuery[0] === 0 ? goodFeed : resultQuery[0].SALDO} + ${goodFeed}, GETDATE(), '0', '${FUNCIONARIO}', '${NUMERO_ODF}', '0', '0', '0', 0, 0, 0, '0', 'DESCRI', 1, 'E', '${address}', 1.00, 'APONTAMENTO', '${hostname}', '${ip}'
        FROM ESTOQUE(NOLOCK)
        WHERE 1 = 1 
        AND CODIGO = '${codigoPeca}' 
        GROUP BY CODIGO`;
    queryArray.push(string);
    try {
        const resUpdate = await (0, update_1.update)(4, values);
        if (!resUpdate || resUpdate.length <= 0 || resUpdate[0] === 0) {
            if (codigoFilho) {
                codigoFilho.split(',').forEach((element) => {
                    queryArray.push(`INSERT INTO CST_ESTOQUE_ENDERECOS (CODIGO, ENDERECO, QUANTIDADE, ODF, DATAHORA) VALUES ('${element}',  '${address}',  ${QTDE_LIB}, '${NUMERO_ODF}', GETDATE())`);
                });
            }
            if (!resultQuery) {
                return null;
            }
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            const x = await connection.query(queryArray.join('\n')).then(result => result.rowsAffected);
            if (!x) {
                return null;
            }
        }
        return (0, message_1.message)("Sucess");
    }
    catch (error) {
        console.log('Error on insertHisrealAndCstEstoque ', error);
        return null;
    }
};
exports.insertHisrealAndCstEstoque = insertHisrealAndCstEstoque;
//# sourceMappingURL=updateQuantityCstStorage.js.map