"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_create_1 = __importDefault(require("../services/user/user.service.create"));
const user_service_dashboard_1 = __importDefault(require("../services/user/user.service.dashboard"));
const user_service_get_1 = __importDefault(require("../services/user/user.service.get"));
const user_service_monthlyPointed_1 = __importDefault(require("../services/user/user.service.monthlyPointed"));
const user_service_weeklyPointed_1 = __importDefault(require("../services/user/user.service.weeklyPointed"));
class UserData {
    static async getUserData(req, res) {
        return new user_service_get_1.default().getUser(req, res);
    }
    static async createUserData(req, res) {
        return new user_service_create_1.default().create(req, res);
    }
    static async getPointDashboard(req, res) {
        return new user_service_dashboard_1.default().dashboard(req, res);
    }
    static async getDashboardPointedMonthly(req, res) {
        return new user_service_monthlyPointed_1.default().dashboard(req, res);
    }
    static async getDashboardPointedWeekly(req, res) {
        return new user_service_weeklyPointed_1.default().dashboard(req, res);
    }
}
exports.default = UserData;
//# sourceMappingURL=user.js.map