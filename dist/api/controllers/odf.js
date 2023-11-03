"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const odf_returnAlocation_service_1 = __importDefault(require("../services/odf/odf.returnAlocation.service"));
const odf_feed_service_1 = __importDefault(require("../services/odf/odf.feed.service"));
const odf_init_service_1 = __importDefault(require("../services/odf/odf.init.service"));
const odf_point_service_1 = __importDefault(require("../services/odf/odf.point.service"));
const odf_return_service_1 = __importDefault(require("../services/odf/odf.return.service"));
const odf_suport_service_1 = __importDefault(require("../services/odf/odf.suport.service"));
const odf_findAll_service_1 = __importDefault(require("../services/odf/odf.findAll.service"));
const odf_search_service_1 = __importDefault(require("../services/odf/odf.search.service"));
class Odf {
    constructor() { }
    static async point(req, res) {
        return new odf_point_service_1.default().point(req, res);
    }
    static async init(req, res) {
        return new odf_init_service_1.default().init(req, res);
    }
    static async feed(req, res) {
        return new odf_feed_service_1.default().feed(req, res);
    }
    static async returnPoint(req, res) {
        return new odf_return_service_1.default().returnPoint(req, res);
    }
    static async suport(req, res) {
        return new odf_suport_service_1.default().suport(req, res);
    }
    static async returnAlocation(req, res) {
        return new odf_returnAlocation_service_1.default().returnAlocation(req, res);
    }
    static async findAllOdfs(req, res) {
        return new odf_findAll_service_1.default().all(req, res);
    }
    static async searchOdfs(req, res) {
        return new odf_search_service_1.default().search(req, res);
    }
}
exports.default = Odf;
//# sourceMappingURL=odf.js.map