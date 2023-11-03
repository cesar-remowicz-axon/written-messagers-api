import { Request, Response } from 'express';
export default class Odf {
    constructor();
    static point(req: Request, res: Response): Promise<Record<string, any>>;
    static data(req: Request, res: Response): Promise<Record<string, any>>;
}
//# sourceMappingURL=point.d.ts.map