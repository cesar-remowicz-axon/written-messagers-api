import { Request, Response } from "express";
export default class CookiesC {
    static clear(req: Request, res: Response): Promise<Record<string, any>>;
    static clearCookies(res: Response | any, cookies: {
        [key: string]: string;
    }): Promise<number>;
}
//# sourceMappingURL=clear.d.ts.map