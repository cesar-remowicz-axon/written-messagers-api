"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegexCheck {
    constructor() { }
    ;
    checkForPatternZeros(value) {
        const regExPattern = /^0+$/;
        if (!value)
            return true;
        return regExPattern.test(value);
    }
    ;
}
exports.default = RegexCheck;
//# sourceMappingURL=regexCheckForZeros.js.map