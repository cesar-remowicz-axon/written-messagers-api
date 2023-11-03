"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypted = void 0;
const decrypted = (numberOdf) => {
    if (typeof (numberOdf) === 'object') {
        return numberOdf;
    }
    const crypto = require('crypto');
    const algorithm = process.env['ALGORITH_ENCRYPTED'];
    const key = process.env['SECRET_ODF_KEY'];
    const iv = process.env['IV'];
    const decypher = crypto.createDecipheriv(algorithm, key, iv);
    var decrypted = decypher.update(numberOdf, 'hex', 'utf-8');
    decrypted += decypher.final('utf-8');
    return decrypted;
};
exports.decrypted = decrypted;
//# sourceMappingURL=decryptedOdf.js.map