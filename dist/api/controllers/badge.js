"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manageSupervisor_service_1 = __importDefault(require("../services/badge/manageSupervisor.service"));
const supervisor_service_1 = __importDefault(require("../services/badge/supervisor.service"));
const employee_service_1 = __importDefault(require("../services/badge/employee.service"));
class Badge {
    static async supervisor(req, res) {
        return new supervisor_service_1.default().supervisor(req, res);
    }
    static async employee(req, res) {
        return new employee_service_1.default().employee(req, res);
    }
    static async findEmployess(req, res) {
        return new manageSupervisor_service_1.default().findUsersAndSupervisor(req, res);
    }
}
exports.default = Badge;
//# sourceMappingURL=badge.js.map