"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieGenerator = void 0;
const encryptOdf_1 = require("./encryptOdf");
const cookieGenerator = async (res, object) => {
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
};
exports.cookieGenerator = cookieGenerator;
//# sourceMappingURL=cookieGenerator.js.map