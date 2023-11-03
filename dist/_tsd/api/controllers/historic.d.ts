import { Request, Response } from 'express';
export default class Historic {
    constructor();
    static pointed(req: Request, res: Response): Promise<Response<string, any>>;
    static rip(req: Request, res: Response): Promise<Response<string, any>>;
    static address(req: Request, res: Response): Promise<Response<string, any>>;
    static storage(req: Request, res: Response): Promise<Response<string, any>>;
}
//# sourceMappingURL=historic.d.ts.map