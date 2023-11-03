"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = __importDefault(require("./api/router"));
const express_1 = __importDefault(require("express"));
const routeParameters_1 = __importDefault(require("./api/utils/routeParameters"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routeParameters_1.default.sanitizeReq);
app.use("/messagers/api/v1", router_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map