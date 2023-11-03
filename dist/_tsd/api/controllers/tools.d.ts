import { Request, Response } from "express";
export default class Tools {
    static toolsProcess(req: Request, res: Response): Promise<Record<string, any>>;
    static selectedTools(req: Request, res: Response): Promise<Record<string, any>>;
}
//# sourceMappingURL=tools.d.ts.map