import { Request, Response } from "express";
export default class Cookies {
    constructor();
    static filter(res: Response | any, cookies: {
        [key: string]: string;
    }): Promise<number>;
    static clear(req: Request, res: Response): Promise<Record<string, any>>;
    static generate(res: {
        [key: string]: any;
    } | null, object: {
        [key: string]: string | unknown;
    } | null): Promise<Number | null>;
}
//# sourceMappingURL=cookies.d.ts.map