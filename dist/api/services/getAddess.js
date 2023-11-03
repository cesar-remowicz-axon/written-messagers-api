"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = void 0;
const selectAddress_1 = require("./selectAddress");
const message_1 = require("./message");
const getAddress = async (valueOfParts) => {
    let address = await (0, selectAddress_1.selectAddress)();
    return { message: (0, message_1.message)(1), address: address };
};
exports.getAddress = getAddress;
//# sourceMappingURL=getAddess.js.map