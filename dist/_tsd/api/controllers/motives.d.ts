import { Request, Response } from 'express';
export default class Motives {
    constructor();
    static findAllMotives(req: Request, res: Response): Promise<Response<{
        [key: string]: string;
    }>>;
}
//# sourceMappingURL=motives.d.ts.map