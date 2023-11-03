"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const update = async (opt, values) => {
    values = !values ? {} : values;
    opt = !opt ? '' : opt;
    const codes = {
        0: `UPDATE ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} SET TEMPO_APTO_TOTAL = GETDATE() WHERE 1 = 1 AND NUMERO_ODF = ${values.NUMERO_ODF} AND CAST (LTRIM(NUMERO_OPERACAO) AS INT) = ${values.NUMERO_OPERACAO} AND CODIGO_MAQUINA = '${values.CODIGO_MAQUINA}'`,
        1: `UPDATE ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} SET QTDE_LIB = ${values.QTDE_LIB} WHERE 1 = 1 AND NUMERO_ODF = ${values.NUMERO_ODF} AND NUMERO_OPERACAO = ${values.NUMERO_OPERACAO};`,
        2: `
        BEGIN TRANSACTION
            UPDATE ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} SET CODIGO_PECA = '${String(values.CODIGO_PECA)}', QTDE_APONTADA = ${values.valorApontado}, QTD_BOAS = QTD_BOAS - ${values.pointGoodFeed || 0}, QTD_FALTANTE = COALESCE(QTD_FALTANTE, 0) + ${values.pointMissingFeed || null}, QTDE_LIB = ${values.QTDE_LIB || 0}, QTD_REFUGO = QTD_REFUGO - ${values.pointBadFeed || 0}, QTD_ESTORNADA = COALESCE(QTD_ESTORNADA, 0 ) + ${values.valorTotal || 0} WHERE 1 = 1 AND NUMERO_ODF = '${values.NUMERO_ODF || 0}' AND CAST (LTRIM(NUMERO_OPERACAO) AS INT) = ${Number(values.NUMERO_OPERACAO || 0)} AND CODIGO_MAQUINA = '${values.CODIGO_MAQUINA || null}'
        IF @@ROWCOUNT = 0
            BEGIN
                ROLLBACK TRANSACTION;
                RETURN;
            END;
        COMMIT TRANSACTION;`,
        3: `UPDATE ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} SET 
                    QTDE_APONTADA = ${values.valorApontado}, 
                    QTD_REFUGO = COALESCE(QTD_REFUGO, 0) + ${values.pointBadFeed || 0}, 
                    QTDE_LIB = COALESCE(QTDE_LIB, 0) - ${values.released || 0}, 
                    QTD_FALTANTE = COALESCE(QTD_FALTANTE, 0) + ${values.pointMissingFeed || 0}, 
                    QTD_BOAS = COALESCE(QTD_BOAS, 0) + ${values.pointGoodFeed || 0}, 
                    QTD_RETRABALHADA = COALESCE(QTD_RETRABALHADA, 0) + ${Number(values.pointReworkFeed) || 0}                    
                    WHERE 1 = 1 
                    AND NUMERO_ODF = ${values.NUMERO_ODF || null} 
                    AND CAST (LTRIM(NUMERO_OPERACAO) AS INT) = ${values.NUMERO_OPERACAO || null} 
                    AND CODIGO_MAQUINA = '${values.CODIGO_MAQUINA || null}'`,
        4: `UPDATE ${process.env['MS_TABLE_OF_ADDRESS']} SET QUANTIDADE = COALESCE(QUANTIDADE, 0) + ${values.quantityToProduce}, DATAHORA = GETDATE(), ODF = ${values.NUMERO_ODF},  WHERE 1 = 1 AND ENDERECO = '${values.address}'`,
        5: `UPDATE ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} SET QTDE_ODF = ${values.QTDE_ODF}, QTDE_LIB = ${values.QTDE_LIB} WHERE 1 = 1 AND NUMERO_ODF = ${values.NUMERO_ODF} AND NUMERO_OPERACAO = ${values.NUMERO_OPERACAO};`,
        6: `UPDATE ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} SET APONTAMENTO_LIBERADO = '${values.pointGoodFeed > 0 ? 'S' : 'N'}' WHERE 1 = 1 AND NUMERO_ODF = ${values.NUMERO_ODF} AND NUMERO_OPERACAO = ${values.NUMERO_OPERACAO};`,
        7: `UPDATE ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} SET APONTAMENTO_LIBERADO = '${values.released > 0 ? 'S' : 'N'}' WHERE 1 = 1 AND NUMERO_ODF = ${values.NUMERO_ODF} AND NUMERO_OPERACAO = ${values.NUMERO_OPERACAO};`,
    };
    return !codes[String(opt)] ? '' : String(codes[String(opt)]);
};
exports.update = update;
//# sourceMappingURL=update.js.map