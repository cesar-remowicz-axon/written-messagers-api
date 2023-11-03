import { Request, Response } from 'express';
export default class Badge {
    static supervisor(req: Request, res: Response): Promise<Response<string, any>>;
    static employee(req: Request, res: Response): Promise<Record<string, any>>;
}
//# sourceMappingURL=supervisor.d.ts.map