import { Request, Response } from 'express';
export default class Parts {
    static storage(req: Request, res: Response): Promise<Record<string, any>>;
    static alterStorage(req: Request, res: Response): Promise<Record<string, any>>;
}
//# sourceMappingURL=part.controller.d.ts.map