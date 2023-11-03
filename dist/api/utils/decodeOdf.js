"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodedBuffer = void 0;
const decodedBuffer = (encodedOdfString) => {
    let decodedBuffer = Buffer.from(encodedOdfString, 'hex').toString('utf-8');
    return decodedBuffer;
};
exports.decodedBuffer = decodedBuffer;
//# sourceMappingURL=decodeOdf.js.map