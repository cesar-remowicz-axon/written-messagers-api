"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = void 0;
const sanitize = (input) => {
    if (typeof (input) === 'number') {
        return input;
    }
    if (typeof (input) === 'object') {
        return input;
    }
    if (!input || input === '0' || input === '00' || input === '000' || input === '0000' || input === '00000' || input === '000000' || input === '0000000' || input === '00000000') {
        return null;
    }
    const allowedChars = /[A-Za-z0-9çÇ,#.-' ']/;
    input = input && input.split('').map((char) => (allowedChars.test(char) ? char : '')).join('');
    return input;
};
exports.sanitize = sanitize;
//# sourceMappingURL=sanitize.js.map