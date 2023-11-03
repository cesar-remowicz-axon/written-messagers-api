"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decryptedOdf_1 = require("../utils/decryptedOdf");
class Inicializer {
    static initSanitize(req, _res, next) {
        const allowedCharsToBeTested = /[A-Za-z0-9çÇ%áãé/' '.-]/;
        for (const [key, value] of Object.entries(req.body)) {
            const sanitized = String(value).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
            req.body[key] = !sanitized ? null : sanitized;
        }
        const newRip = {};
        if (req.path === `/pointclients/api/v1/pointRip`) {
            for (const [key, value] of Object.entries(req.body)) {
                newRip[key] = value;
            }
        }
        else {
            req.body['message'] = "Sucesso";
            req.body['supervisorVer'] = "";
            req.body['general'] = null;
            req.body['result'] = null;
            req.body['codigo'] = null;
            req.body['detail'] = null;
            req.body['code'] = null;
        }
        req.body["newRip"] = newRip;
        for (const [key, value] of Object.entries(req.cookies)) {
            const decryptedData = !(0, decryptedOdf_1.decrypted)(value) ? null : (0, decryptedOdf_1.decrypted)(value);
            if (decryptedData) {
                let sanitized = String(decryptedData).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
                if (sanitized.split("%%%").length > 1) {
                    const result = [];
                    const arrayOfSanitizedItens = sanitized.split('%%%');
                    for (let i = 0; i < arrayOfSanitizedItens.length; i++) {
                        if (arrayOfSanitizedItens[i]) {
                            result.push(arrayOfSanitizedItens[i]);
                        }
                    }
                    req.body[key] = !result ? null : result;
                }
                else {
                    req.body[key] = !sanitized ? null : sanitized;
                }
            }
        }
        for (const [key, value] of Object.entries(req.query)) {
            const sanitized = String(value).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
            req.query[key] = !sanitized ? null : sanitized;
        }
        return next();
    }
}
exports.default = Inicializer;
;
//# sourceMappingURL=inicializer.js.map