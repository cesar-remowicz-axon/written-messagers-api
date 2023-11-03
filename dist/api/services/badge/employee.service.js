"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../../utils/message");
const cookies_1 = __importDefault(require("../../controllers/cookies"));
const query_1 = require("../../utils/query");
class BadgeServiceEmployee {
    async employee(req, res) {
        const apiResponse = req.body;
        const regExPattern = /^0+$/;
        const { badge, EMPLOYEE_MOD } = apiResponse;
        if (!badge || regExPattern.test(badge)) {
            apiResponse['message'] = (0, message_1.message)("Nobadge");
            return res.status(200).json(apiResponse);
        }
        let resource = null;
        if (EMPLOYEE_MOD === 'TRUE') {
            resource = await (0, query_1.select)('tableAllEmployees', { badge });
            if (!resource) {
                apiResponse['message'] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
        }
        else {
            resource = [{ FUNCIONARIO: 'FUNCIONARIO', CRACHA: '000000', employee: 'FUNCIONARIO', badge: '000000' }];
        }
        if (resource[0]) {
            for (const [key, value] of Object.entries(resource[0])) {
                apiResponse[key] = value;
            }
        }
        else {
            apiResponse['message'] = 'Crachá não encontrado';
        }
        await cookies_1.default.generate(res, resource[0]);
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = BadgeServiceEmployee;
//# sourceMappingURL=employee.service.js.map