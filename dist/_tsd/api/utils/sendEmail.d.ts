export default class Email {
    static send(odfNumber: number | 'S/I', operationNumber: number | 'S/I', machineCode: string | 'S/I', reworkFeed: number | 'S/I', missingFeed: number | 'S/I', goodFeed: number | 'S/I', badFeed: number | 'S/I', totalPointed: number | 'S/I', qtdOdf: number | 'S/I', clientCode: string | 'S/I', partCode: string | 'S/I'): Promise<void>;
    static create(): Promise<void>;
    static alter(): Promise<void>;
}
//# sourceMappingURL=sendEmail.d.ts.map