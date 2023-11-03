"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CookiesC {
    static async clear(req, res) {
        const apiResponse = req.body || null;
        await this.clearCookies(res, req['cookies']);
        return res.status(200).json(apiResponse);
    }
    static async clearCookies(res, cookies) {
        for (let i = 0; i < Object.keys(cookies).length; i++) {
            if (Object.keys(cookies)[i] !== 'badFeedDescription' && Object.keys(cookies)[i] !== 'stopMotives' && Object.keys(cookies)[i] !== 'returnMotives') {
                res.clearCookie(Object.keys(cookies)[i]);
            }
        }
        return 1;
    }
}
exports.default = CookiesC;
//# sourceMappingURL=clear.js.map