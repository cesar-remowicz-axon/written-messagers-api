"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieCleaner = void 0;
const cookieCleaner = async (res, cookies) => {
    for (let i = 0; i < Object.keys(cookies).length; i++) {
        if (Object.keys(cookies)[i] !== 'badFeedDescription' && Object.keys(cookies)[i] !== 'stopMotives' && Object.keys(cookies)[i] !== 'returnMotives') {
            res.clearCookie(Object.keys(cookies)[i]);
        }
    }
    return 1;
};
exports.cookieCleaner = cookieCleaner;
//# sourceMappingURL=clearCookie.js.map