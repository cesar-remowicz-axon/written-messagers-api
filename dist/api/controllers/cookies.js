"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encryptOdf_1 = require("../utils/encryptOdf");
class Cookies {
    constructor() { }
    ;
    static async filter(res, cookies) {
        for (let i = 0; i < Object.keys(cookies).length; i++) {
            if (Object.keys(cookies)[i] !== 'badFeedDescription' && Object.keys(cookies)[i] !== 'stopMotives' && Object.keys(cookies)[i] !== 'returnMotives' && Object.keys(cookies)[i] !== 'token') {
                res.clearCookie(Object.keys(cookies)[i]);
            }
        }
        return 1;
    }
    static async clear(req, res) {
        const apiResponse = req.body || null;
        for (let i = 0; i < Object.keys(req.cookies).length; i++) {
            if (Object.keys(req.cookies)[i] !== 'badFeedDescription' && Object.keys(req.cookies)[i] !== 'stopMotives' && Object.keys(req.cookies)[i] !== 'returnMotives' && Object.keys(req.cookies)[i] !== 'token') {
                res.clearCookie(Object.keys(req.cookies)[i]);
            }
        }
        return res.status(200).json(apiResponse);
    }
    static async generate(res, object) {
        if (!object) {
            return null;
        }
        try {
            for (const [key, value] of Object.entries(object)) {
                if (value) {
                    if (typeof value === 'object') {
                        const valuesObj = value;
                        const array = [];
                        for (let i = 0; i < valuesObj.length; i++) {
                            array.push(`${valuesObj[i]}%%%`);
                        }
                        res["cookie"](`${key}`, (0, encryptOdf_1.encrypted)(String(`${array}`)), { maxAge: 900000, expires: true, httpOnly: false, });
                    }
                    else {
                        res["cookie"](`${key}`, (0, encryptOdf_1.encrypted)(String(`${value}`)), { maxAge: 900000, expires: true, httpOnly: false, });
                    }
                }
                else {
                    res["cookie"](`${key}`, (0, encryptOdf_1.encrypted)(String(`${value}`)), { maxAge: 900000, expires: true, httpOnly: false, });
                }
            }
            return 1;
        }
        catch (error) {
            console.log("Error on cookie generator", error);
            return null;
        }
    }
}
exports.default = Cookies;
//# sourceMappingURL=cookies.js.map