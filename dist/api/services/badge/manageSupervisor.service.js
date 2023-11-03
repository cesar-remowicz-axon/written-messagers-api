"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../../utils/query");
class BadgeServiceFindEmployees {
    async findUsersAndSupervisor(req, res) {
        const apiResponse = req.body;
        const { badge, EMPLOYEE_MOD } = apiResponse;
        const regExPattern = /^0+$/;
        if (!badge || typeof badge !== 'string' || regExPattern.test(badge)) {
            return res.status(200).json(apiResponse);
        }
        if (EMPLOYEE_MOD !== 'TRUE') {
            return res.status(200).json(apiResponse);
        }
        const employee = await (0, query_1.select)('tableAllEmployees', { badge });
        if (employee) {
            apiResponse['employee'] = employee;
        }
        else {
            apiResponse['employee'] = null;
        }
        const supervisor = await (0, query_1.select)('tableOfSupervisors', { supervisor: badge });
        if (supervisor) {
            apiResponse['supervisor'] = supervisor;
        }
        else {
            apiResponse['supervisor'] = null;
        }
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = BadgeServiceFindEmployees;
//# sourceMappingURL=manageSupervisor.service.js.map