"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Query {
    constructor() { }
    ;
    static async builder(array) {
        const stringfromArray = [];
        for (let i = 0; i < array.length; i++) {
            const eachQuerie = array[i];
            stringfromArray.push(`
                ${eachQuerie}  
                                IF @@ROWCOUNT = 0      
                                    BEGIN          
                                        ROLLBACK TRANSACTION;          
                                        RETURN;      
                                    END
                                    `);
        }
        const str = `
        BEGIN TRANSACTION;
            ${stringfromArray}
        COMMIT TRANSACTION;
        `;
        return str;
    }
}
exports.default = Query;
//# sourceMappingURL=queryBuilder.js.map