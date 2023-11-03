"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookieGenerator_1 = require("../utils/cookieGenerator");
const message_1 = require("../services/message");
const query_1 = require("../services/query");
const global_config_1 = require("../../global.config");
const mssql_1 = __importDefault(require("mssql"));
class Badge {
    static async supervisor(req, res) {
        const apiResponse = req.body || null;
        const { SUPERVISOR_MOD, supervisor } = apiResponse;
        const VIEW_GRUPO_APT = 10;
        if (SUPERVISOR_MOD === 'TRUE') {
            if (!apiResponse || !apiResponse['supervisor']) {
                apiResponse['message'] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            const resource = await (0, query_1.select)(VIEW_GRUPO_APT, { supervisor });
            if (!resource) {
                apiResponse["supervisor"] = apiResponse['supervisor'];
                apiResponse['message'] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            for (const [key, value] of Object.entries(resource[0])) {
                apiResponse[key] = value;
            }
        }
        await (0, cookieGenerator_1.cookieGenerator)(res, { supervisorVer: `verificado` });
        return res.status(200).json(apiResponse);
    }
    static async employee(req, res) {
        const apiResponse = req.body || null;
        const { badge, EMPLOYEE_MOD } = apiResponse;
        if (!badge) {
            apiResponse['message'] = (0, message_1.message)("Nobadge");
            return res.status(200).json(apiResponse);
        }
        let resource = null;
        if (EMPLOYEE_MOD === 'TRUE') {
            const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
            resource = await connection.query(`
                    SELECT TOP 1 [FUNCIONARIO], [CRACHA] FROM FUNCIONARIOS WHERE 1 = 1 AND [CRACHA] = '${badge}' ORDER BY FUNCIONARIO`)
                .then((result) => result['recordset']);
            if (!resource) {
                apiResponse['message'] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
        }
        else {
            resource = [{ FUNCIONARIO: 'FUNCIONARIO', CRACHA: '000000' }];
        }
        if (resource[0]) {
            for (const [key, value] of Object.entries(resource[0])) {
                apiResponse[key] = value;
            }
        }
        await (0, cookieGenerator_1.cookieGenerator)(res, resource[0]);
        req.cookies = null;
        resource = null;
        req.body = null;
        return res.status(200).json(apiResponse);
    }
}
exports.default = Badge;
//# sourceMappingURL=supervisor.js.map