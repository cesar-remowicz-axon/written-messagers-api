"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userData_service_1 = __importDefault(require("../services/userData.service"));
class UserData {
    static async post(req, res) {
        return new userData_service_1.default().post(req, res);
    }
}
exports.default = UserData;
//# sourceMappingURL=getUserData.controllers.js.map