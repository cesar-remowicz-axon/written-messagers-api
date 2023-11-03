"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiTest {
    constructor() { }
    ;
    static async get(req, res) {
        const apiResponse = req.body || null;
        apiResponse['message'] = 'Get success';
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
//# sourceMappingURL=apiTest.js.map