"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = require("../../../global.config");
const mssql_1 = __importDefault(require("mssql"));
const message_1 = require("../../utils/message");
const ipFunc_1 = require("../../utils/ipFunc");
const query_1 = require("../../utils/query");
const verifyCodeNote_1 = require("../../utils/verifyCodeNote");
class AddressServicePost {
    async post(req, res) {
        const apiResponse = req.body || null;
        const strQuery = [];
        const lastProcessOperationNumber = '999';
        const ip = await (0, ipFunc_1.ipAdd)();
        const allowedCodePointed = [3];
        let { CODIGO_PECA, newAdd, NUMERO_OPERACAO, NUMERO_ODF, ENDERECO_MOD, QTDE_LIB, FUNCIONARIO, QTD_BOAS, QTDE_ODF, QTD_REFUGO, QTD_RETRABALHADA, QTD_FALTANTE, QTDE_APONTADA } = apiResponse;
        NUMERO_OPERACAO = Number(String(NUMERO_OPERACAO));
        QTDE_LIB = Number(QTDE_LIB);
        QTDE_ODF = Number(QTDE_ODF);
        QTD_REFUGO = Number(QTD_REFUGO);
        QTD_RETRABALHADA = Number(QTD_RETRABALHADA);
        QTD_FALTANTE = Number(QTD_FALTANTE);
        QTDE_APONTADA = Number(QTDE_APONTADA);
        QTD_BOAS = Number(QTD_BOAS);
        if (CODIGO_PECA.includes('RE.')) {
            CODIGO_PECA = CODIGO_PECA.split('.')[2];
        }
        const viewOdfsGathered = 'viewOdfsGathered';
        const resourceVw = await (0, query_1.select)(viewOdfsGathered, { NUMERO_ODF, NUMERO_OPERACAO });
        if (resourceVw.length <= 0) {
            apiResponse['message'] = 'Valor excede o limite';
            return res.status(200).json(apiResponse);
        }
        const boas = Number(resourceVw[0].QTD_BOAS) || 0;
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({
            NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO
        }, allowedCodePointed);
        const { accepted, code } = hisaponta;
        if (!accepted) {
            apiResponse["message"] = (0, message_1.message)("Pointed");
            return res.status(200).json(apiResponse);
        }
        apiResponse['code'] = code;
        if (ENDERECO_MOD === 'TRUE') {
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            const cstStorage = await connection.query(`SELECT QUANTIDADE FROM CST_ESTOQUE_ENDERECOS WHERE 1 = 1 AND ODF = '${NUMERO_ODF}'`).then((result) => result['recordset']);
            const HISREAL = 29;
            const resource = await (0, query_1.select)(HISREAL, { partCode: CODIGO_PECA });
            let somaOfQuantityCst = 0;
            if (cstStorage['length'] > 0) {
                for (let i = 0; i < cstStorage['length']; i++) {
                    const value = Number(cstStorage[i].QUANTIDADE);
                    somaOfQuantityCst += value;
                }
                if (typeof somaOfQuantityCst !== 'number') {
                    await connection.close();
                    apiResponse["message"] = 'Erro ao ver endereço';
                    return res.status(200).json(apiResponse);
                }
                if (somaOfQuantityCst === null || somaOfQuantityCst === undefined || somaOfQuantityCst === Infinity || Number.isNaN(somaOfQuantityCst)) {
                    await connection.close();
                    apiResponse["message"] = 'Erro ao ver endereço';
                    return res.status(200).json(apiResponse);
                }
                if (somaOfQuantityCst !== boas) {
                    await connection.close();
                    apiResponse["message"] = (0, message_1.message)("Success");
                    return res.status(200).json(apiResponse);
                }
            }
            const arr = [];
            for (const [key, value] of Object.entries(newAdd)) {
                arr.push(`UPDATE CST_ESTOQUE_ENDERECOS SET QUANTIDADE = COALESCE(QUANTIDADE, 0) + ${Number(value)} WHERE 1 = 1 AND CODIGO = '${String(CODIGO_PECA)}' AND ENDERECO = '${key}' AND ODF = '${NUMERO_ODF}'`);
            }
            const connec = await mssql_1.default.connect(global_config_1.sqlConfig);
            const resour = await connec.query(arr.join('\n')).then((result) => result['rowsAffected']);
            await connec.close();
            if (!resour || resour['length'] <= 0) {
                await connection.close();
                apiResponse["message"] = 'Erro ao ver endereço';
                return res.status(200).json(apiResponse);
            }
            const arrOfDef = [];
            for (let i = 0; i < resour['length']; i++) {
                if (resour[i] === 0) {
                    arrOfDef.push(i);
                }
            }
            for (let i = 0; i < arrOfDef.length; i++) {
                const address = Object.entries(newAdd)[arrOfDef[i]][0];
                const value = Number(Object.entries(newAdd)[arrOfDef[i]][1]);
                strQuery.push(`INSERT INTO CST_ESTOQUE_ENDERECOS (CODIGO, ENDERECO, QUANTIDADE, ODF, DATAHORA) VALUES ('${String(CODIGO_PECA)}', '${String(address)}', ${Number(value)}, '${String(NUMERO_ODF)}', GETDATE())`);
            }
            let sum = 0;
            for (const [key, value] of Object.entries(newAdd)) {
                sum += Number(value);
                if (NUMERO_OPERACAO === lastProcessOperationNumber) {
                    strQuery.push(`INSERT INTO HISTORICO_ENDERECO (DATAHORA, ODF, QUANTIDADE, CODIGO_PECA, CODIGO_FILHO, ENDERECO_ATUAL, STATUS, NUMERO_OPERACAO) VALUES (GETDATE(), '${NUMERO_ODF}', ${Number(value)}, ${CODIGO_PECA}, ${null}, '${key}', 'APONTADO', '${NUMERO_OPERACAO}')`);
                    strQuery.push(`INSERT INTO HISREAL (CODIGO, DOCUMEN, DTRECEB, QTRECEB, VALPAGO, FORMA, SALDO, DATA, LOTE, USUARIO, ODF, NOTA, LOCAL_ORIGEM, LOCAL_DESTINO, CUSTO_MEDIO, CUSTO_TOTAL, CUSTO_UNITARIO, CATEGORIA, DESCRICAO, EMPRESA_RECNO, ESTORNADO_APT_PRODUCAO, CST_ENDERECO, VERSAOSISTEMA, CST_SISTEMA, CST_HOSTNAME, CST_IP) SELECT CODIGO, '${NUMERO_ODF}/${CODIGO_PECA}', GETDATE(), ${Number(value)}, 0 , 'E', ${!resource || resource[0] === 0 || !resource[0].SALDO ? Number(value) : resource[0].SALDO} + ${Number(value)}, GETDATE(), '0', '${FUNCIONARIO}', '${NUMERO_ODF}', '0', '0', '0', 0, 0, 0, '0', 'DESCRI', 1, 'E', '${key}}', 1.01, 'APONTAMENTO', '${req.get('host')}', '${ip}' FROM ESTOQUE(NOLOCK) WHERE 1 = 1  AND CODIGO = '${CODIGO_PECA}'  GROUP BY CODIGO`);
                }
            }
            strQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + ${Number(sum)} WHERE 1 = 1 AND CODIGO = '${CODIGO_PECA}'`);
            if (sum > QTDE_LIB) {
                apiResponse['message'] = 'Valor excede o limite';
                await connection.close();
                return res.status(200).json(apiResponse);
            }
        }
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        const resultFromUpdate = await connection.query(strQuery.join('\n')).then((result) => result['rowsAffected']);
        await connection.close();
        if (!resultFromUpdate[0] || resultFromUpdate['length'] <= 0 || resultFromUpdate[0] === 0) {
            apiResponse['message'] = 'Erro ao atualizar o endereco';
        }
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = AddressServicePost;
//# sourceMappingURL=post.service.js.map