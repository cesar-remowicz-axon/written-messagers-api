"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypted = void 0;
const encrypted = (odfNumber) => {
    const crypto = require('crypto');
    const algorithm = process.env['ALGORITH_ENCRYPTED'];
    const key = process.env['SECRET_ODF_KEY'];
    const iv = process.env['IV'];
    const anotherCrypto = crypto.createCipheriv(algorithm, key, iv);
    let criptoOdfString = anotherCrypto.update(odfNumber, 'utf-8', 'hex');
    criptoOdfString += anotherCrypto.final('hex');
    return criptoOdfString;
};
exports.encrypted = encrypted;
//# sourceMappingURL=encryptOdf.js.map