"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../../utils/message");
const cookies_1 = __importDefault(require("../../controllers/cookies"));
const query_1 = require("../../utils/query");
class BadgeServiceSupervisor {
    async supervisor(req, res) {
        const apiResponse = req.body;
        const regExPattern = /^0+$/;
        const { SUPERVISOR_MOD, supervisor } = apiResponse;
        if (SUPERVISOR_MOD === 'TRUE') {
            if (!apiResponse || !apiResponse['supervisor'] || regExPattern.test(supervisor)) {
                apiResponse['message'] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            const resource = await (0, query_1.select)('tableOfSupervisors', { supervisor });
            if (!resource) {
                apiResponse["supervisor"] = apiResponse['supervisor'];
                apiResponse['message'] = (0, message_1.message)("Nobadge");
                return res.status(200).json(apiResponse);
            }
            for (const [key, value] of Object.entries(resource[0])) {
                apiResponse[key] = value;
            }
        }
        await cookies_1.default.generate(res, { supervisorVer: `verificado` });
        return res.status(200).json(apiResponse);
    }
}
exports.default = BadgeServiceSupervisor;
//# sourceMappingURL=supervisor.service.js.map