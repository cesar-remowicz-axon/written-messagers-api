"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = require("../../global.config");
const mssql_1 = __importDefault(require("mssql"));
class Modules {
    static async getUserModules(req, res, next) {
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        if (!connection) {
            return res.status(200).json({ message: null });
        }
        const modulesAvailable = await connection.query(`SELECT TOP 1 EMPLOYEE_MOD, ENDERECO_MOD, RIP_MOD, DESENHO_TECNICO_MOD, FERRAMENTA_MOD, SUPERVISOR_MOD, MOTIVOS_MOD, EMAIL_MOD, ESTOQUE_MOD, HISTORICO_MOD 
                                FROM USER_MODULES WHERE 1 = 1 AND COMPANY_ID = ${req.query["COMPANY_ID"]} ORDER BY ID DESC`).then((result) => result["recordset"]);
        if (!modulesAvailable) {
            return res.status(200).json({ message: null });
        }
        for (const [key, value] of Object.entries(modulesAvailable[0])) {
            req.body[key] = value;
        }
        return next();
    }
}
exports.default = Modules;
;
//# sourceMappingURL=userModules.js.map