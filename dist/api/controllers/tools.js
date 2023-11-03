"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findTools_service_1 = __importDefault(require("../services/tools/findTools.service"));
const selectedTools_service_1 = __importDefault(require("../services/tools/selectedTools.service"));
class Tools {
    static async toolsProcess(req, res) {
        return new findTools_service_1.default().findTools(req, res);
    }
    static async selectedTools(req, res) {
        return new selectedTools_service_1.default().selected(req, res);
    }
}
exports.default = Tools;
;
//# sourceMappingURL=tools.js.map