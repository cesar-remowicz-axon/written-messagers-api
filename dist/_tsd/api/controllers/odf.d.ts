import { Request, Response } from "express";
export default class Odf {
    constructor();
    static point(req: Request, res: Response): Promise<Record<string, any>>;
    static init(req: Request, res: Response): Promise<Record<string, any>>;
    static feed(req: Request, res: Response): Promise<Record<string, any>>;
    static returnPoint(req: Request, res: Response): Promise<Response<string, any>>;
    static suport(req: Request, res: Response): Promise<Response<string, any>>;
    static returnAlocation(req: Request, res: Response): Promise<Response<string, any>>;
    static findAllOdfs(req: Request, res: Response): Promise<Response<string, any>>;
    static searchOdfs(req: Request, res: Response): Promise<Response<string, any>>;
}
//# sourceMappingURL=odf.d.ts.map