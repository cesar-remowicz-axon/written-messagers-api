"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../../utils/query");
class UserServiceDashboardWeeklyPointed {
    async dashboard(req, res) {
        const apiResponse = req.body;
        const dashBoardTotalWeeklyAmountOfParts = await (0, query_1.select)('dashBoardTotalWeeklyAmountOfParts');
        apiResponse['dashBoardTotalWeeklyAmountOfParts'] = dashBoardTotalWeeklyAmountOfParts[0];
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = UserServiceDashboardWeeklyPointed;
//# sourceMappingURL=user.service.weeklyPointed.js.map