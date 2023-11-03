"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = require("../../../global.config");
const mssql_1 = __importDefault(require("mssql"));
class UserServiceCreateData {
    async create(req, res) {
        const apiResponse = req.body;
        const { email, company_name } = apiResponse;
        if (!email || !company_name) {
            apiResponse['message'] = 'Erro ao criar conta';
            return res.status(200).json(apiResponse);
        }
        if (typeof email !== 'string' || typeof company_name !== 'string') {
            apiResponse['message'] = 'Erro ao criar conta';
            return res.status(200).json(apiResponse);
        }
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        if (!connection) {
            return res.status(200).json({ message: null });
        }
        connection.close();
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = UserServiceCreateData;
//# sourceMappingURL=user.service.create.js.map