import { NextFunction, Request, Response } from "express";
export default class RouteParams {
    constructor();
    static sanitizeReq(req: Request, _res: Response, next: NextFunction): void;
    static parametersReq(req: Request, res: Response, next: NextFunction): Promise<Response<string, any> | void>;
}
//# sourceMappingURL=routeParameters.d.ts.map