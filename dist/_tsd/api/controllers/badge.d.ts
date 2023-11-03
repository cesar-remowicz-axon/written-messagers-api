import { Request, Response } from 'express';
export default class Badge {
    static supervisor(req: Request, res: Response): Promise<Record<string, any>>;
    static employee(req: Request, res: Response): Promise<Record<string, any>>;
    static findEmployess(req: Request, res: Response): Promise<Record<string, any>>;
}
//# sourceMappingURL=badge.d.ts.map