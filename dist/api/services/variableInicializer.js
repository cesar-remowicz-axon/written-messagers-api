"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inicializer = void 0;
const decryptedOdf_1 = require("../utils/decryptedOdf");
const inicializer = async (body, cookies, query, allReq) => {
    const sanitizedDecryptedResponse = {};
    const sanitizedDecryptedResponse22222 = {};
    const allowedCharsToBeTested = /[A-Za-z0-9çÇ' '.-]/;
    let soma1 = 0;
    const arrayOfTimers = [];
    let soma2 = 0;
    const timers = [];
    for (let i = 0; i < 10000; i++) {
        try {
            const y = performance.now();
            if (body) {
                if (Object.entries(body).length > 0) {
                    for (const [key, value] of Object.entries(body)) {
                        const decryptedData = !(0, decryptedOdf_1.decrypted)(value) ? null : (0, decryptedOdf_1.decrypted)(value);
                        if (decryptedData) {
                            const sanitized = String(decryptedData).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
                            sanitizedDecryptedResponse22222[key] = !sanitized ? null : sanitized;
                        }
                    }
                }
            }
            if (cookies) {
                if (Object.keys(cookies).length > 0) {
                    for (const [key, value] of Object.entries(cookies)) {
                        const sanitized = String(value).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
                        sanitizedDecryptedResponse22222[key] = !(0, decryptedOdf_1.decrypted)(sanitized) ? null : (0, decryptedOdf_1.decrypted)(sanitized);
                    }
                }
            }
            if (query) {
                if (Object.keys(query).length > 0) {
                    for (const [key, value] of Object.entries(query)) {
                        const decryptedData = !(0, decryptedOdf_1.decrypted)(value) ? null : (0, decryptedOdf_1.decrypted)(value);
                        if (decryptedData) {
                            const sanitized = String(decryptedData).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
                            sanitizedDecryptedResponse22222[key] = !sanitized ? null : sanitized;
                        }
                    }
                }
            }
            const t2 = performance.now() - y;
            timers.push(t2);
            const x = performance.now();
            for (const [_key, value] of Object.entries(allReq)) {
                for (const [key, value2] of Object.entries(value)) {
                    const sanitized = String(!(0, decryptedOdf_1.decrypted)(value2) ? '' : (0, decryptedOdf_1.decrypted)(value2)).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
                    sanitizedDecryptedResponse[key] = !(sanitized) ? null : (sanitized);
                }
            }
            const f1 = performance.now() - x;
            arrayOfTimers.push(f1);
        }
        catch (error) {
            return null;
        }
    }
    for (let i = 0; i < arrayOfTimers.length; i++) {
        soma1 += arrayOfTimers[i];
    }
    const m2 = soma1 / arrayOfTimers.length;
    for (let i = 0; i < timers.length; i++) {
        soma2 += timers[i];
    }
    const m1 = soma2 / timers.length;
    return sanitizedDecryptedResponse;
};
exports.inicializer = inicializer;
//# sourceMappingURL=variableInicializer.js.map