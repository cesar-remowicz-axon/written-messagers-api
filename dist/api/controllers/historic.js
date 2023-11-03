"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pointed_service_1 = __importDefault(require("../services/historic/pointed.service"));
const address_service_1 = __importDefault(require("../services/historic/address.service"));
const storage_service_1 = __importDefault(require("../services/historic/storage.service"));
const rip_service_1 = __importDefault(require("../services/historic/rip.service"));
class Historic {
    constructor() { }
    ;
    static async pointed(req, res) {
        return new pointed_service_1.default().pointed(req, res);
    }
    static async rip(req, res) {
        return new rip_service_1.default().rip(req, res);
    }
    static async address(req, res) {
        return new address_service_1.default().address(req, res);
    }
    static async storage(req, res) {
        return new storage_service_1.default().storage(req, res);
    }
}
exports.default = Historic;
;
//# sourceMappingURL=historic.js.map