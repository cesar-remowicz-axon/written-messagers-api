"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_service_1 = __importDefault(require("../services/rip/get.service"));
const post_service_1 = __importDefault(require("../services/rip/post.service"));
class Rip {
    constructor() { }
    ;
    static async get(req, res) {
        return new get_service_1.default().get(req, res);
    }
    static async post(req, res) {
        return new post_service_1.default().post(req, res);
    }
}
exports.default = Rip;
;
//# sourceMappingURL=rip.js.map