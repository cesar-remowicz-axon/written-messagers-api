"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getUserData_controllers_1 = __importDefault(require("./controllers/getUserData.controllers"));
const apiRouter = (0, express_1.Router)();
apiRouter.route("/sendData")
    .post(getUserData_controllers_1.default.post);
exports.default = apiRouter;
//# sourceMappingURL=router.js.map