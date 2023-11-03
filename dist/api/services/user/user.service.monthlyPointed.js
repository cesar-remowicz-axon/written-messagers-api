"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../../utils/query");
class UserServiceDashboardMonthlyPointed {
    async dashboard(req, res) {
        const apiResponse = req.body;
        const dashBoardTotalMonthlyAmountOfParts = await (0, query_1.select)('dashBoardTotalMonthlyAmountOfParts');
        apiResponse['dashBoardTotalWeeklyAmountOfParts'] = dashBoardTotalMonthlyAmountOfParts[0];
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = UserServiceDashboardMonthlyPointed;
//# sourceMappingURL=user.service.monthlyPointed.js.map