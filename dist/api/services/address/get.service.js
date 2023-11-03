"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = require("../../../global.config");
const mssql_1 = __importDefault(require("mssql"));
const query_1 = require("../../utils/query");
class AddressServiceGet {
    async get(req, res) {
        const OPERACAO = 3;
        const apiResponse = req.body;
        let { CODIGO_PECA, CODIGO_MAQUINA, REVISAO } = apiResponse;
        let dimensionsFatherComponents;
        if (CODIGO_PECA.includes('RE.')) {
            dimensionsFatherComponents = await (0, query_1.select)('OperacaoSemRevisao', { CODIGO_PECA, REVISAO });
            CODIGO_PECA = CODIGO_PECA.split('.')[2];
        }
        else {
            dimensionsFatherComponents = await (0, query_1.select)(OPERACAO, { CODIGO_PECA, REVISAO });
        }
        const sizes = {
            comprimento: 0,
            largura: 0,
            peso: 0,
        };
        if (dimensionsFatherComponents[0]) {
            sizes.comprimento = dimensionsFatherComponents[0] ? dimensionsFatherComponents[0].COMPRIMENTO : 0;
            sizes.largura = dimensionsFatherComponents[0] ? dimensionsFatherComponents[0].LARGURA : 0;
            sizes.peso = dimensionsFatherComponents[0] ? dimensionsFatherComponents[0].EXECUT : 0;
        }
        let percen = '5';
        const expedition = 'EX002';
        if (CODIGO_MAQUINA === expedition) {
            percen = '7';
        }
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        const arrayNotin = [];
        const result = [];
        const vwAddressStorage = await connection.query(`SELECT * FROM ${process.env['MS_TABLE_CONTAINER_STORAGE_IN_ADDRESS']} WHERE 1 = 1 AND COD_PRODUTO  = '${CODIGO_PECA}'`).then((result) => result['recordset']);
        if (vwAddressStorage['length'] > 0) {
            for (let i = 0; i < vwAddressStorage['length']; i++) {
                arrayNotin.push(vwAddressStorage[i].CODIGO);
                result.push(vwAddressStorage[i]);
            }
            apiResponse['result'] = result;
        }
        if (sizes.comprimento > 1200) {
            await connection.close();
            apiResponse['result'] = [{
                    ALTURA: null, CODIGO: null, COD_PRODUTO: null, COD_PRODUTO_EST: null, COMPRIMENTO: null, ENDERECO: "Z-PADRÃO", LARGURA: null, PESO: null, QUANTIDADE: null
                }];
            return res.status(200).json(apiResponse);
        }
        const addressAvailable = await connection.query(`SELECT DISTINCT TOP 2
                ENDERECO,
                CODIGO
                FROM ${process.env['MS_TABLE_CONTAINER_STORAGE_IN_ADDRESS']} 
                WHERE 1 = 1 
                AND COD_PRODUTO IS NULL 
	            AND ENDERECO LIKE '${percen}%' 
                AND ENDERECO NOT LIKE '${percen}Z%' 
                AND ENDERECO NOT LIKE '%QUA%'
                AND ENDERECO NOT LIKE '%X%' 
                AND ENDERECO NOT LIKE '%EX%'
                AND COMPRIMENTO > ${sizes.comprimento} 
                AND LARGURA > ${sizes.largura} 
                AND PESO > ${sizes.peso} 
                AND CODIGO NOT IN (${arrayNotin.length <= 0 ? '0000' : arrayNotin.join(',')});`).then((result) => result['recordset']);
        if (addressAvailable['length'] <= 0) {
            await connection.close();
            apiResponse['result'] = [{
                    ALTURA: null, CODIGO: null, COD_PRODUTO: null, COD_PRODUTO_EST: null, COMPRIMENTO: null, ENDERECO: "Z-PADRÃO", LARGURA: null, PESO: null, QUANTIDADE: null
                }];
            return res.status(200).json(apiResponse);
        }
        else {
            for (let i = 0; i < addressAvailable['length']; i++) {
                result.push(addressAvailable[i]);
                arrayNotin.push(addressAvailable[i].CODIGO);
            }
        }
        const otherAddress = await connection.query(`SELECT DISTINCT TOP 1 
                ENDERECO,
                CODIGO
                FROM ${process.env['MS_TABLE_CONTAINER_STORAGE_IN_ADDRESS']} 
                WHERE 1 = 1 
                AND COD_PRODUTO IS NULL 
	            AND ENDERECO LIKE '${percen}%' 
                AND ENDERECO NOT LIKE '${percen}Z%' 
                AND ENDERECO NOT LIKE '%QUA%'
                AND ENDERECO NOT LIKE '%X%' 
                AND ENDERECO NOT LIKE '%EX%'
                AND COMPRIMENTO > ${sizes.comprimento} 
                AND LARGURA > ${sizes.largura} 
                AND PESO > ${sizes.peso} 
                AND CODIGO NOT IN (${arrayNotin.length <= 0 ? '0000' : arrayNotin.join(',')});`).then((result) => result['recordset']);
        if (otherAddress['length'] > 0) {
            for (let i = 0; i < otherAddress['length']; i++) {
                result.push(otherAddress[i]);
            }
        }
        await connection.close();
        apiResponse['result'] = result;
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = AddressServiceGet;
//# sourceMappingURL=get.service.js.map