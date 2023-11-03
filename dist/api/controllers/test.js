"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../utils/message");
class ApiTest {
    constructor() { }
    ;
    static async get(req, res) {
        const apiResponse = req.body || null;
        apiResponse['message'] = (0, message_1.message)('Success');
        return res.status(200).json(apiResponse);
    }
    ;
    static async post(req, res) {
        const apiResponse = req.body || null;
        apiResponse['message'] = 'Post success';
        return res.status(200).json(apiResponse);
    }
    static async alter(req, res) {
        const apiResponse = req.body || null;
        apiResponse['message'] = 'Put success';
        return res.status(200).json(apiResponse);
    }
}
exports.default = ApiTest;
//# sourceMappingURL=test.js.map