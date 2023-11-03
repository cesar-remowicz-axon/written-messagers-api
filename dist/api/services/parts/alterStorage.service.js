"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const regexCheckForZeros_1 = __importDefault(require("../../utils/regexCheckForZeros"));
const query_1 = require("../../utils/query");
const global_config_1 = require("../../../global.config");
const mssql_1 = __importDefault(require("mssql"));
class PartsServiceAlterStorage {
    async alter(req, res) {
        const udpateString = [];
        const apiResponse = req.body;
        if (!apiResponse)
            return res.status(200).json(apiResponse);
        const checkedBadge = new regexCheckForZeros_1.default().checkForPatternZeros(apiResponse['supervisor']);
        if (checkedBadge)
            return res.status(200).json(apiResponse);
        const { part, address, supervisor } = apiResponse;
        const resourceOfSupervisor = await (0, query_1.select)('tableOfSupervisors', { supervisor });
        if (!resourceOfSupervisor) {
            apiResponse['message'] = 'Crachá não encontrado';
            return res.status(200).json(apiResponse);
        }
        if (!part[0].part) {
            apiResponse['message'] = 'Peça não encontrada';
            return res.status(200).json(apiResponse);
        }
        const resourceOfPart = await (0, query_1.select)('partStorage', { part: part[0].part });
        if (!resourceOfPart) {
            apiResponse['message'] = 'Peça não encontrada';
            return res.status(200).json(apiResponse);
        }
        const resourceOfAddresses = await (0, query_1.select)('addressPerPart', { part: part[0].part });
        if (!resourceOfAddresses) {
            apiResponse['message'] = 'Endereço não encontrado';
            return res.status(200).json(apiResponse);
        }
        const quantityInStorage = resourceOfPart[0].quantity;
        if (!quantityInStorage) {
            apiResponse['message'] = 'Sem valores a serem alterados';
            return res.status(200).json(apiResponse);
        }
        let totalAmountUserSend = 0;
        for (let j = 0; j < resourceOfAddresses.length; j++) {
            totalAmountUserSend += Number(address[j].quantity);
            const partId = address[j].id;
            const addressUserSend = resourceOfAddresses[j].address;
            const addressInSystem = address[j].address;
            if (addressInSystem != addressUserSend) {
                apiResponse['message'] = "Endereços não conferem";
                return res.status(200).json(apiResponse);
            }
            if (partId !== resourceOfAddresses[j].id) {
                apiResponse['message'] = "Endereços não conferem";
                return res.status(200).json(apiResponse);
            }
        }
        if (totalAmountUserSend !== quantityInStorage) {
            apiResponse['message'] = 'Quantidades de estoque e usuario não são iguais';
            return res.status(200).json(apiResponse);
        }
        for (let j = 0; j < address.length; j++) {
            const addressName = address[j].address;
            const value = Number(address[j].quantity) ? Number(address[j].quantity) : 0;
            const partId = address[j].id;
            if (value === 0) {
                udpateString.push(`UPDATE CST_ESTOQUE_ENDERECOS SET QUANTIDADE = NULL, CODIGO = NULL, ODF = NULL WHERE 1 = 1 AND ENDERECO = '${addressName}' AND CODIGO = '${part[0].part}' AND R_E_C_N_O_ = '${partId}';`);
            }
            else {
                udpateString.push(`UPDATE CST_ESTOQUE_ENDERECOS SET QUANTIDADE = ${value} WHERE 1 = 1 AND ENDERECO = '${addressName}' AND CODIGO = '${part[0].part}' AND
                R_E_C_N_O_ = '${partId}';`);
            }
        }
        if (udpateString.length > 0) {
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            await connection.query(udpateString.join('')).then((result) => result);
            await connection.close();
        }
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = PartsServiceAlterStorage;
//# sourceMappingURL=alterStorage.service.js.map