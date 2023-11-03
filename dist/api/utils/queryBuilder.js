"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor() { }
    ;
    select(table, column, where) {
        return `SELECT ${column} FROM ${table} WHERE 1 = 1 AND ${where}`;
    }
    delete(table, where) {
        return `DELETE ${table} WHERE 1 = 1 AND ${where}`;
    }
    update(table, column, where) {
        return `UPDATE ${table} SET ${column} WHERE 1 = 1 AND ${where}`;
    }
    insert(table, column) {
        return `INSERT INTO ${table} VALUES(${column})`;
    }
}
exports.default = QueryBuilder;
//# sourceMappingURL=queryBuilder.js.map