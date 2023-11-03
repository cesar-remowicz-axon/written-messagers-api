"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookies_1 = __importDefault(require("./cookies"));
const message_1 = require("../utils/message");
const query_1 = require("../utils/query");
class Motives {
    constructor() { }
    ;
    static async findAllMotives(req, res) {
        const apiResponse = req.body;
        const { MOTIVOS_MOD, badFeedDescription, stopMotives, returnMotives } = apiResponse;
        if (MOTIVOS_MOD === 'FALSE') {
            apiResponse['message'] = (0, message_1.message)("NoModule");
            return res.status(200).json(apiResponse);
        }
        async function checkAndGet(motive, motiveName) {
            const resourceOfMotives = await (0, query_1.select)(motive);
            const resultOf = [];
            const result = [];
            const resourceLength = resourceOfMotives['length'];
            if (resourceLength > 0) {
                for (let i = 0; i < resourceLength; i++) {
                    const item = resourceOfMotives[i][`${process.env['MS_COLUMN_DESCRIPTION_MOTIVES_POINT']}`];
                    result.push(`${item}%%%`);
                    resultOf.push(item);
                }
            }
            await cookies_1.default.generate(res, { motiveName: result });
            apiResponse[`${motiveName}`] = resultOf;
        }
        if (!badFeedDescription) {
            await checkAndGet('tableBadFeedMotives', 'badFeedDescription');
        }
        if (!stopMotives) {
            await checkAndGet('tableStopMotives', 'stopMotives');
        }
        if (!returnMotives) {
            await checkAndGet('returnPointMotives', 'returnMotives');
        }
        return res.status(200).json(apiResponse);
    }
}
exports.default = Motives;
;
//# sourceMappingURL=motives.js.map