import { Request, Response } from 'express';
export default class Address {
    static post(req: Request, res: Response): Promise<Record<string, any>>;
    static get(req: Request, res: Response): Promise<Record<string, any>>;
}
//# sourceMappingURL=address.d.ts.map