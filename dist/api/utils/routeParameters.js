"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RouteParams {
    constructor() { }
    ;
    static sanitizeReq(req, res, next) {
        const allowedCharsToBeTested = /[A-Za-z0-9çÇ%áãé/@?;/)(*&¨%$#+}{!' '.-]/;
        const stringsToTest = ['SEL', 'DEL', "INSE", 'UPD'];
        for (const [key, value] of Object.entries(req.body)) {
            if (value && typeof value === 'string') {
                const sanitized = String(value).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
                let sanChecked = !sanitized || sanitized === 'null' || sanitized === 'undefined' || sanitized === Infinity || sanitized === 'Infinity' ? null : sanitized;
                for (let i = 0; i < stringsToTest.length; i++) {
                    const element = stringsToTest[i];
                    sanChecked = sanChecked.toUpperCase()?.includes(element) ? null : sanChecked;
                    if (sanChecked === null)
                        break;
                }
                req.body[key] = sanChecked;
            }
        }
        const auth = req.headers.authorization;
        const companyId = process.env['COMPANY_ID'];
        if (auth !== companyId) {
            return res.json({ message: null });
        }
        return next();
    }
}
exports.default = RouteParams;
//# sourceMappingURL=routeParameters.js.map