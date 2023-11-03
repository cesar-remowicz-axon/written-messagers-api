"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decryptedOdf_1 = require("../utils/decryptedOdf");
class RouteParams {
    constructor() { }
    ;
    static sanitizeReq(req, _res, next) {
        const allowedCharsToBeTested = /[A-Za-z0-9çÇ%áãé/' '.-]/;
        for (const [key, value] of Object.entries(req.body)) {
            if (value && typeof value === 'string') {
                const sanitized = String(value).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
                const sanChecked = !sanitized || sanitized === 'null' || sanitized === 'undefined' || sanitized === Infinity || sanitized === 'Infinity' ? null : sanitized;
                req.body[key] = sanChecked;
            }
        }
        const newAdd = {};
        const newRip = {};
        if (req.path === `/pointClients/api/v1/address/postAdd`) {
            for (const [key, value] of Object.entries(req.body)) {
                newAdd[key] = value;
                req.body['message'] = "Sucesso";
                req.body['supervisorVer'] = null;
                req.body['general'] = null;
                req.body['result'] = null;
                req.body['codigo'] = null;
                req.body['detail'] = null;
                req.body['code'] = null;
                req.body['QTDE_ENDERECADO'] = null;
                req.body['alocado'] = null;
                req.body['hisaponta'] = null;
            }
        }
        else if (req.path === `/pointClients/api/v1/pointRip`) {
            for (const [key, value] of Object.entries(req.body)) {
                newRip[key] = value;
            }
        }
        else {
            req.body['message'] = "Sucesso";
            req.body['supervisorVer'] = null;
            req.body['general'] = null;
            req.body['result'] = null;
            req.body['codigo'] = null;
            req.body['detail'] = null;
            req.body['code'] = null;
            req.body['QTDE_ENDERECADO'] = null;
            req.body['alocado'] = null;
            req.body['hisaponta'] = null;
        }
        req.body['newAdd'] = newAdd;
        req.body["newRip"] = newRip;
        for (const [key, value] of Object.entries(req.cookies)) {
            const decryptedData = !(0, decryptedOdf_1.decrypted)(value) || value === 'null' || value === 'undefined' ? null : (0, decryptedOdf_1.decrypted)(value);
            if (decryptedData && decryptedData !== 'null' && decryptedData !== "undefined") {
                let sanitized = String(decryptedData).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
                const sanChecked = !sanitized || sanitized === 'null' || sanitized === 'undefined' || sanitized === Infinity || sanitized === 'Infinity' ? null : sanitized;
                if (sanChecked && sanChecked !== 0) {
                    if (sanChecked.split("%%%").length > 1) {
                        const result = [];
                        const arrayOfSanitizedItens = sanChecked.split('%%%');
                        for (let i = 0; i < arrayOfSanitizedItens.length; i++) {
                            if (arrayOfSanitizedItens[i]) {
                                result.push(arrayOfSanitizedItens[i]);
                            }
                        }
                        req.body[key] = !result ? null : result;
                    }
                    else {
                        req.body[key] = !sanChecked ? null : sanChecked;
                    }
                }
            }
            else {
                req.body[key] = !decryptedData || decryptedData === 'null' || decryptedData === 'undefined' || decryptedData === Infinity || decryptedData === 'Infinity' ? null : decryptedData;
            }
        }
        for (const [key, value] of Object.entries(req.query)) {
            if (typeof value === 'string') {
                const sanitized = String(value).split('').map((char) => allowedCharsToBeTested.test(char) ? char : '').join('');
                req.query[key] = !sanitized ? null : sanitized;
            }
        }
        return next();
    }
    static async parametersReq(req, res, next) {
        if (!req.query['COMPANY_ID']) {
            return res.status(200).json({ message: null });
        }
        const queryRequest = {
            COMPANY_ID: String(req.query['COMPANY_ID']),
        };
        const path = req.path;
        if (path === '/pointClients/api/v1/tools' ||
            path === '/pointClients/api/v1/selTools' ||
            path === '/pointClients/api/v1/point' ||
            path === '/pointClients/api/v1/rip' ||
            path === '/pointClients/api/v1/pointRip' ||
            path === '/pointClients/api/v1/verifyCodeNote' ||
            path === '/pointClients/api/v1/drawing' ||
            path === '/pointClients/api/v1/feedData' ||
            path === '/pointClients/api/v1/machineControl' ||
            path === '/pointClients/api/v1/address/callAdd' ||
            path === '/pointClients/api/v1/address/postAdd') {
            queryRequest['FUNCIONARIO'] = req.body['FUNCIONARIO'];
            queryRequest['CRACHA'] = req.body['CRACHA'];
            queryRequest['NUMERO_ODF'] = req.body['NUMERO_ODF'];
            queryRequest['NUMERO_OPERACAO'] = req.body['NUMERO_OPERACAO'];
            queryRequest['CODIGO_MAQUINA'] = req.body['CODIGO_MAQUINA'];
            queryRequest['CODIGO_PECA'] = req.body['CODIGO_PECA'];
        }
        else if (path === '/pointClients/api/v1/odf' ||
            path === '/pointClients/api/v1/address' ||
            path === "/pointClients/api/v1/returnMotives") {
            queryRequest['FUNCIONARIO'] = req.body['FUNCIONARIO'];
            queryRequest['CRACHA'] = req.body['CRACHA'];
        }
        else if (path === "/pointClients/api/v1/badge") {
            queryRequest['badge'] = req.body['badge'];
        }
        else if (path === "/pointClients/api/v1/supervisor" || path === '/pointClients/api/v1/odf/returnAlocation') {
            queryRequest['supervisor'] = req.body['supervisor'];
        }
        else if (path === "/pointClients/api/v1/clearAll" ||
            path === '/pointClients/api/v1/rip/ripLogs' ||
            path === '/pointClients/api/v1/returnedValue' ||
            path === '/pointClients/api/v1/connectionApiTest' ||
            path === '/pointClients/api/v1/odf/viewOdf' ||
            path === '/pointClients/api/v1/odf/allOdf' ||
            path === '/pointClients/api/v1/odf/searchOdf' ||
            path === '/pointClients/api/v1/historic' ||
            path === '/pointClients/api/v1/storageHistoric') {
        }
        else {
            return res.status(200).json({ message: null });
        }
        for (const [_key, value] of Object.entries(queryRequest)) {
            if (!value) {
                return res.status(200).json({ message: null });
            }
        }
        ;
        return next();
    }
}
exports.default = RouteParams;
//# sourceMappingURL=routeParameters.js.map