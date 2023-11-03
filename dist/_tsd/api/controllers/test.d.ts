import { Request, Response } from "express";
export default class ApiTest {
    constructor();
    static get(req: Request, res: Response): Promise<Response<string, any>>;
    static post(req: Request, res: Response): Promise<Response<string, any>>;
    static alter(req: Request, res: Response): Promise<Response<string, any>>;
}
//# sourceMappingURL=test.d.ts.map