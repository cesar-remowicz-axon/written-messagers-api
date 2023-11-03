"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertInto = void 0;
const insertInto = async (pointedCode, funcionario, numOdf, codPeca, revisao, numOper, codMaq, qtdLib, goodFeed, badFeed, pointedCodeDescription, _tempoDecorrido, motives, missingFeed, reworkFeed) => {
    const strArr = [];
    for (let i = 0; i < pointedCode.length; i++) {
        strArr.push(`
        BEGIN TRANSACTION
            INSERT INTO ${process.env['MS_TABLE_CONTAINER_OF_POINTED_CODES']}
                                (DATAHORA, 
                                USUARIO, 
                                ODF,
                                PECA, 
                                REVISAO, 
                                NUMOPE,
                                NUMSEQ, 
                                CONDIC, 
                                ITEM,
                                QTD, 
                                PC_BOAS, 
                                PC_REFUGA,
                                ID_APONTA, 
                                LOTE, 
                                CODAPONTA,
                                CAMPO1, 
                                TEMPO_SETUP, 
                                APT_TEMPO_OPERACAO ,
                                EMPRESA_RECNO,
                                MOTIVO_REFUGO, 
                                CST_PC_FALTANTE,
                                CST_QTD_RETRABALHADA, 
                                CAMPO2) 
                            VALUES (
                                GETDATE(),
                                '${String(funcionario)}', 
                                ${numOdf},
                                '${String(codPeca)}',
                                '${String(revisao)}', 
                                '${String(numOper)}',
                                '${String(numOper)}', 
                                'D', 
                                '${String(codMaq)}',
                                ${Number(qtdLib) || null},
                                ${pointedCode[i] === 4 ? Number(goodFeed) : null},
                                ${pointedCode[i] === 4 ? Number(badFeed) : null},
                                '${String(funcionario)}', 
                                '0',
                                ${Number(pointedCode[i])},
                                '${Number(pointedCode[i])}', 
                                CAST(GETDATE() AS DECIMAL(19,4)), CAST(GETDATE() AS DECIMAL(19,4)),
                                '1',
                                '${String(motives)}',
                                ${pointedCode[i] === 4 ? Number(missingFeed) : null},
                                ${pointedCode[i] === 4 ? Number(reworkFeed) : null},
                                '${String(pointedCodeDescription[i])}');
                    COMMIT TRANSACTION;`);
    }
    return strArr.join('');
};
exports.insertInto = insertInto;
//# sourceMappingURL=insert.js.map