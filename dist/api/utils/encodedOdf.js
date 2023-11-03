"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encoded = void 0;
const encoded = (numberOdf) => {
    let encodedOdfString = Buffer.from(numberOdf, 'utf-8').toString('hex');
    return encodedOdfString;
};
exports.encoded = encoded;
//# sourceMappingURL=encodedOdf.js.map