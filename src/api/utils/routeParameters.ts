import { NextFunction, Request, Response } from "express";

export default class RouteParams {

    constructor() { };

    public static sanitizeReq(req: Request, res: Response, next: NextFunction) {
        const allowedCharsToBeTested = /[A-Za-z0-9çÇ%áãé/@?;/)(*&¨%$#+}{!' '.-]/;
        const stringsToTest = ['SEL', 'DEL', "INSE", 'UPD'];

        for (const [key, value] of Object.entries(req.body)) {

            if (value && typeof value === 'string') {
                const sanitized: any = String(value).split('').map((char: string) => allowedCharsToBeTested.test(char) ? char : '').join('');
                let sanChecked = !sanitized || sanitized === 'null' || sanitized === 'undefined' || sanitized === Infinity || sanitized === 'Infinity' ? null : sanitized;
                for (let i = 0; i < stringsToTest.length; i++) {
                    const element = stringsToTest[i];
                    sanChecked = sanChecked.toUpperCase()?.includes(element) ? null : sanChecked;
                    if (sanChecked === null) break;
                }
                req.body[key] = sanChecked;
            }
        }

        const auth = req.headers.authorization;
        const companyId = process.env['COMPANY_ID'];

        if (auth !== companyId) {
            return res.json({ message: null })
        }

        return next();
    }
}