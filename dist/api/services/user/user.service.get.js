"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserServiceData {
    async getUser(req, res) {
        const apiResponse = req.body;
        const clientData = {};
        for (let i = 0; i < Object.entries(apiResponse).length; i++) {
            const key = Object.entries(apiResponse)[i][0];
            const value = Object.entries(apiResponse)[i][1];
            if (key.split('_MOD').length > 1) {
                clientData[key] = value;
            }
            if (key === 'totensHired') {
                apiResponse['activeMachine'] = !value ? 0 : value;
            }
        }
        apiResponse.clientData = clientData;
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = UserServiceData;
//# sourceMappingURL=user.service.get.js.map