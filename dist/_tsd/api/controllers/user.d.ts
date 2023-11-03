import { Request, Response } from 'express';
export default class UserData {
    static getUserData(req: Request, res: Response): Promise<Record<string, any>>;
    static createUserData(req: Request, res: Response): Promise<Record<string, any>>;
    static getPointDashboard(req: Request, res: Response): Promise<Record<string, any>>;
    static getDashboardPointedMonthly(req: Request, res: Response): Promise<Record<string, any>>;
    static getDashboardPointedWeekly(req: Request, res: Response): Promise<Record<string, any>>;
}
//# sourceMappingURL=user.d.ts.map