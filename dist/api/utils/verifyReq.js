"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyReq = void 0;
async function verifyReq(obj) {
    for (const [_key, value] of Object.entries(obj)) {
        if (!value) {
            return null;
        }
    }
    return 1;
}
exports.verifyReq = verifyReq;
//# sourceMappingURL=verifyReq.js.map