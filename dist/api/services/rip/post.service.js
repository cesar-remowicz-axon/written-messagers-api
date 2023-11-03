"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyCodeNote_1 = require("../../utils/verifyCodeNote");
const global_config_1 = require("../../../global.config");
const insert_1 = require("../../utils/insert");
const message_1 = require("../../utils/message");
const query_1 = require("../../utils/query");
const update_1 = require("../../utils/update");
const mssql_1 = __importDefault(require("mssql"));
class RipServicePost {
    constructor() { }
    async post(req, res) {
        const apiResponse = req.body;
        const updateQtyQuery = [];
        const codeNumberSix = [6];
        const allowedCharsToBeTested = [5];
        const viewOdfsGathered = 30;
        const productionOdfs = 0;
        let { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, RIP_MOD, FUNCIONARIO, CODIGO_PECA, REVISAO, QTDE_LIB, numCar, descricao, especif, instrumento, lse, lie } = apiResponse;
        NUMERO_OPERACAO = String(Number(String(NUMERO_OPERACAO)));
        CODIGO_MAQUINA = String(CODIGO_MAQUINA.replaceAll(' ', ''));
        NUMERO_ODF = String(NUMERO_ODF.replaceAll(' ', ''));
        if (typeof NUMERO_ODF !== 'string' || typeof NUMERO_ODF !== 'string' || typeof NUMERO_ODF !== 'string') {
            apiResponse['message'] = "Erro ao finalizar o processo";
            return res.status(200).json(apiResponse);
        }
        if (!numCar || !descricao || !especif || !instrumento || !lse || !lie) {
            apiResponse['message'] = "Erro ao finalizar o processo";
            return res.status(200).json(apiResponse);
        }
        const hisaponta = await (0, verifyCodeNote_1.codePoint)({
            NUMERO_ODF, NUMERO_OPERACAO, FUNCIONARIO
        }, allowedCharsToBeTested);
        const { code, accepted } = hisaponta;
        if (!accepted) {
            apiResponse['message'] = "Erro ao finalizar o processo";
            return res.status(200).json(apiResponse);
        }
        apiResponse["code"] = code;
        const resource = await (0, query_1.select)(viewOdfsGathered, { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA });
        if (!resource) {
            apiResponse['message'] = "Erro ao finalizar o processo";
            return res.status(200).json(apiResponse);
        }
        apiResponse['qtdelib'] = resource[0]['QTDE_LIB'];
        updateQtyQuery.push(await (0, update_1.update)(productionOdfs, { NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA }));
        if (RIP_MOD === 'TRUE') {
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
                updateQtyQuery.push(`INSERT INTO ${process.env['MS_TABLE_CONTAINER_POINTED_RIP']} (${process.env['MS_COLUMN_FOR_POINT_RIP']}) 
                                                            VALUES('${apiResponse['NUMERO_ODF']}', '${FUNCIONARIO || null}' ,'1', '${REVISAO}' , 
                                                            '${numCar[i]}', '${descricao[i]}', 
                                                             '${especif[i]}',${lie[i]}, ${lse[i]},${rows[item]['SETUP'] ? `'${rows[item]['SETUP']}'` : null}, 
                                                             ${rows[item]['M2'] ? `${rows[item]['M2']}` : null},${rows[item]['M3'] ? `${rows[item]['M3']}` : null},${rows[item]['M4'] ? `${rows[item]['M4']}` : null}, 
                                                             ${rows[item]['M5'] ? `${rows[item]['M5']}` : null},${rows[item]['M6'] ? `${rows[item]['M6']}` : null},${rows[item]['M7'] ? `${rows[item]['M7']}` : null},
                                                             ${rows[item]['M8'] ? `${rows[item]['M8']}` : null},${rows[item]['M9'] ? `${rows[item]['M9']}` : null},${rows[item]['M10'] ? `${rows[item]['M10']}` : null},
                                                             ${rows[item]['M11'] ? `${rows[item]['M11']}` : null},${rows[item]['M12'] ? `${rows[item]['M12']}` : null},${rows[item]['M13'] ? `${rows[item]['M13']}` : null},
                                                             '${instrumento[i]}','${CODIGO_MAQUINA}','${NUMERO_OPERACAO}', GETDATE());`);
            }
        }
        try {
            const insertSix = await (0, insert_1.insertInto)(codeNumberSix, FUNCIONARIO, Number(NUMERO_ODF), CODIGO_PECA, REVISAO, NUMERO_OPERACAO, CODIGO_MAQUINA, Number(QTDE_LIB), 0, 0, ['FIN RIP'], 0, null, 0, 0);
            updateQtyQuery.push(insertSix);
            const groupOdf = (await (0, query_1.select)(0, {
                NUMERO_ODF,
            }));
            const indexOdf = groupOdf.findIndex((item) => {
                return (Number(item["NUMERO_OPERACAO"].replaceAll(' ', '')) ===
                    Number(NUMERO_OPERACAO));
            });
            const finalIndex = groupOdf.length - 1;
            if ((groupOdf[indexOdf]['QTDE_ODF'] === groupOdf[indexOdf]['QTDE_APONTADA']) && (indexOdf === finalIndex)) {
                await (0, query_1.select)("deleteOdfQuery", { NUMERO_ODF });
            }
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            await connection.query(updateQtyQuery.join('\n'));
            await connection.close();
            apiResponse['code'] = (0, message_1.message)("RipFin");
            return res.status(200).json(apiResponse);
        }
        catch (error) {
            console.log('Error on insertSix', error);
            apiResponse['message'] = "Erro ao finalizar o processo";
            return res.status(200).json(apiResponse);
        }
    }
}
exports.default = RipServicePost;
//# sourceMappingURL=post.service.js.map