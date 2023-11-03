import { NextFunction, Request, Response } from "express";
export default class RouteParams {
    constructor();
    static sanitizeReq(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
}
//# sourceMappingURL=routeParameters.d.ts.map