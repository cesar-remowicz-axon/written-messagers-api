"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ripPost = void 0;
const verifyCodeNote_1 = require("../services/verifyCodeNote");
const global_config_1 = require("../../global.config");
const insert_1 = require("../services/insert");
const message_1 = require("../services/message");
const update_1 = require("../services/update");
const query_1 = require("../services/query");
const mssql_1 = __importDefault(require("mssql"));
async function ripPost(req, res) {
    const apiResponse = req.body || null;
    const { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, RIP_MOD, FUNCIONARIO, CODIGO_PECA, REVISAO, QTDE_LIB, } = apiResponse;
    const codeNumberSix = [6];
    const allowedCharsToBeTested = [5];
    const updateQtyQuery = [];
    const VW_APP_APTO_PROGRAMACAO_PRODUCAO = 30;
    const PCP_PROGRAMACAO_PRODUCAO = 0;
    const hisaponta = await (0, verifyCodeNote_1.codePoint)({
        NUMERO_ODF, NUMERO_OPERACAO: Number(NUMERO_OPERACAO), CODIGO_MAQUINA
    }, allowedCharsToBeTested);
    const { code, accepted } = hisaponta;
    if (!accepted) {
        return res.status(200).json(apiResponse);
    }
    apiResponse["code"] = code;
    const resource = await (0, query_1.select)(VW_APP_APTO_PROGRAMACAO_PRODUCAO, { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA });
    apiResponse['qtdelib'] = resource[0]['QTDE_LIB'];
    const updateTimerStr = await (0, update_1.update)(PCP_PROGRAMACAO_PRODUCAO, { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA });
    updateQtyQuery.push(updateTimerStr);
    if (RIP_MOD === 'TRUE') {
        try {
            for (let [key, value] of Object.entries(req.body['newRip'])) {
                value = Number(value) || null;
                req.body['newRip'][key] = Number(value);
            }
            const rows = Object.keys(req.body['newRip']).reduce((acc, iterator) => {
                const [col, lin] = iterator.split('-');
                if (acc[lin] === undefined)
                    acc[lin] = {};
                acc[lin][col] = req.body['newRip'][iterator];
                return acc;
            }, {});
            for (let i = 0; i < Object.entries(rows).length; i++) {
                const item = Object.entries(rows)[i][0];
                updateQtyQuery.push(`INSERT INTO CST_RIP_ODF_PRODUCAO (ODF, FUNCIONARIO, ITEM, REVISAO, NUMCAR, DESCRICAO, ESPECIFICACAO, LIE, LSE, SETUP, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12, M13, INSTRUMENTO, OPE_MAQUIN, OPERACAO) 
                                                        VALUES('${apiResponse['NUMERO_ODF']}', '${FUNCIONARIO || null}' ,'1', '${apiResponse['REVISAO']}' , 
                                                        '${apiResponse['numCar'][i]}', '${apiResponse['descricao'][i]}', 
                                                         '${apiResponse['especif'][i]}',${apiResponse['lie'][i]}, ${apiResponse['lse'][i]},${rows[item]['SETUP'] ? `'${rows[item]['SETUP']}'` : null}, 
                                                         ${rows[item]['M2'] ? `${rows[item]['M2']}` : null},${rows[item]['M3'] ? `${rows[item]['M3']}` : null},${rows[item]['M4'] ? `${rows[item]['M4']}` : null}, 
                                                         ${rows[item]['M5'] ? `${rows[item]['M5']}` : null},${rows[item]['M6'] ? `${rows[item]['M6']}` : null},${rows[item]['M7'] ? `${rows[item]['M7']}` : null},
                                                         ${rows[item]['M8'] ? `${rows[item]['M8']}` : null},${rows[item]['M9'] ? `${rows[item]['M9']}` : null},${rows[item]['M10'] ? `${rows[item]['M10']}` : null},
                                                         ${rows[item]['M11'] ? `${rows[item]['M11']}` : null},${rows[item]['M12'] ? `${rows[item]['M12']}` : null},${rows[item]['M13'] ? `${rows[item]['M13']}` : null},
                                                         '${apiResponse['instrumento'][i]}','${apiResponse['CODIGO_MAQUINA']}','${apiResponse['NUMERO_OPERACAO'].replaceAll(' ', '')}')`);
            }
        }
        catch (error) {
            console.log('Error on ripPost linha 100', error);
            apiResponse["message"] = "Erro ao inserir RIP";
            return res.status(200).json(apiResponse);
        }
    }
    try {
        const insertSix = await (0, insert_1.istInto)(codeNumberSix, FUNCIONARIO, Number(NUMERO_ODF), CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, Number(QTDE_LIB), 0, 0, ['FIN RIP'], 0, null, 0, 0);
        updateQtyQuery.push(insertSix);
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        await connection.query(updateQtyQuery.join('\n'));
        if (!insertSix) {
            apiResponse["code"] = code;
            apiResponse['message'] = "Erro ao finalizar o processo";
            return res.status(200).json(apiResponse);
        }
        apiResponse['code'] = (0, message_1.message)("RipFin");
    }
    catch (error) {
        console.log('Error on insertSix', error);
        apiResponse['message'] = "Erro ao finalizar o processo";
        return res.status(200).json(apiResponse);
    }
    return res.status(200).json(apiResponse);
}
exports.ripPost = ripPost;
//# sourceMappingURL=ripPost.js.map