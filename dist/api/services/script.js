"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = void 0;
const query_1 = require("./query");
async function script() {
    const data = await (0, query_1.selectQuery)(54);
    console.log('scrpit rodado...');
    return data;
}
exports.script = script;
//# sourceMappingURL=script.js.map