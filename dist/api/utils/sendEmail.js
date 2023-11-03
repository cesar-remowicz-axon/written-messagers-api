"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
class Email {
    static async send(odfNumber, operationNumber, machineCode, reworkFeed, missingFeed, goodFeed, badFeed, totalPointed, qtdOdf, clientCode, partCode) {
        const account = {
            user: 'cim@martiaco.com.br',
            pass: 'Muc86421',
            martiacoAccount: 'refugo@martiaco.com.br',
        };
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
        const message = {
            from: 'juniorlucaski@gmail.com',
            to: 'juniorlucaski@gmail.com',
            subject: `Nova ordem`,
            text: `Criar nova ordem: \n ODF = ${odfNumber}
            \n Numero_operacao = ${operationNumber}
            \n Codigo_maquina = ${machineCode}
            \n Retrabalhadas = ${reworkFeed}
            \n Faltantes = ${missingFeed}
            \n Boas = ${goodFeed}
            \n Ruins = ${badFeed}
            \n Valor_apontado = ${totalPointed}
            \n Quantidade_total = ${qtdOdf} 
            \n Código_cliente = ${clientCode} 
            \n Codigo_peca = ${partCode} 
            `,
        };
        await transporter.sendMail(message);
    }
    static async create() { }
    ;
    static async alter() { }
    ;
}
exports.default = Email;
//# sourceMappingURL=sendEmail.js.map