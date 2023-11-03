import { Request, Response } from "express";
export default class Pointed {
    constructor();
    static code(req: Request, res: Response): Promise<Response<string, any>>;
}
//# sourceMappingURL=pointedCode.d.ts.map