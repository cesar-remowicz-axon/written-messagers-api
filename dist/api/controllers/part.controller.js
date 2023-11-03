"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_service_1 = __importDefault(require("../services/parts/storage.service"));
const alterStorage_service_1 = __importDefault(require("../services/parts/alterStorage.service"));
class Parts {
    static async storage(req, res) {
        return new storage_service_1.default().get(req, res);
    }
    static async alterStorage(req, res) {
        return new alterStorage_service_1.default().alter(req, res);
    }
}
exports.default = Parts;
//# sourceMappingURL=part.controller.js.map