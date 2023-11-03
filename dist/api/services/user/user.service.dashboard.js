"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../../utils/query");
class UserServiceDashboard {
    async dashboard(req, res) {
        const apiResponse = req.body;
        const resourceOfStoppedMachine = await (0, query_1.select)('dashboardMachineStopped');
        const countOfMachineStopped = resourceOfStoppedMachine.length;
        apiResponse['countOfMachineStopped'] = countOfMachineStopped;
        apiResponse['stoppedOdfNumbers'] = resourceOfStoppedMachine;
        const weeklyAmountPointed = await (0, query_1.select)('dashBoardTotalWeeklyAmountOfParts');
        apiResponse['dashBoardTotalWeeklyAmountOfParts'] = weeklyAmountPointed[0];
        const dashboardOdfInProductionFor10Months = await (0, query_1.select)('dashboardOdfInProductionFor10Months');
        apiResponse['dashboardOdfInProductionFor10Months'] = dashboardOdfInProductionFor10Months;
        apiResponse['totalAmountOfOdsInProductionFor10Months'] = dashboardOdfInProductionFor10Months.length;
        const dashboardFinishOdfIn1YearByMonth = await (0, query_1.select)('dashboardFinishOdfIn1YearByMonth');
        apiResponse['dashboardFinishOdfIn1YearByMonth'] = dashboardFinishOdfIn1YearByMonth;
        if (dashboardFinishOdfIn1YearByMonth) {
            for (let i = 0; i < dashboardFinishOdfIn1YearByMonth.length; i++) {
                const year = String(dashboardFinishOdfIn1YearByMonth[i].Month).slice(0, 4);
                const month = String(dashboardFinishOdfIn1YearByMonth[i].Month).slice(4, 6);
                dashboardFinishOdfIn1YearByMonth[i].Month = month + "/" + year;
            }
        }
        return res.status(200).json(apiResponse);
    }
    ;
}
exports.default = UserServiceDashboard;
//# sourceMappingURL=user.service.dashboard.js.map