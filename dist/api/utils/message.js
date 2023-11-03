"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
const message = (opt) => {
    const str = {
        "Success": "Sucesso",
        "Pointed": "Apontado",
        "SetupIni": "INI SETUP",
        "SetupFin": 'FIN SETUP',
        "ProdIni": 'INI PROD',
        "ProdFin": 'FIN PROD',
        "RipIni": `INI RIP`,
        "RipFin": 'FIN RIP',
        "Return": 'ESTORNO',
        "Stopped": 'STOPPED',
        "ReqError": "Erro na requisição",
        "TryAgain": 'Ocorreu um erro, tente novamente...',
        "Err": "",
        "NoLimit": `Não há quantidade disponível para apontar`,
        "NoModule": "Modulo não suportado",
        "NoImg": "/images/sem_imagem.gif",
        "NoTools": "Sem ferramentas",
        "Nobadge": "Crachá não encontrado",
        "NoDevo": "Não pode ser devolvido",
    };
    return str[opt] || '';
};
exports.message = message;
//# sourceMappingURL=message.js.map