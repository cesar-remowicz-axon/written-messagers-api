"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const token = async (req, _res) => {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(' ');
    return token;
};
exports.token = token;
//# sourceMappingURL=token.js.map