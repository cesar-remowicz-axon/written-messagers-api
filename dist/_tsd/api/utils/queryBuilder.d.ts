export default class QueryBuilder {
    constructor();
    select(table: string, column: string, where: string): string;
    delete(table: string, where: string): string;
    update(table: string, column: string, where: string): string;
    insert(table: string, column: string): string;
}
//# sourceMappingURL=queryBuilder.d.ts.map