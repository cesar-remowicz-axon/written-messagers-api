import { Request, Response } from 'express';
export default class Rip {
    constructor();
    static get(req: Request, res: Response): Promise<Response<string, any>>;
    static post(req: Request, res: Response): Promise<Response<string, any>>;
}
//# sourceMappingURL=rip.d.ts.map