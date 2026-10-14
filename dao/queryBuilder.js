function buildWhereClause(filters, columnByFilter) {
    const activeFilters = Object.entries(columnByFilter).filter(([name]) => filters[name] !== undefined);
    if (activeFilters.length === 0) {
        return { clause: '', params: [] };
    }
    const conditions = activeFilters.map(([, column]) => `${column} = ?`);
    const params = activeFilters.map(([name]) => filters[name]);
    return { clause: `WHERE ${conditions.join(' AND ')}`, params };
}

module.exports = { buildWhereClause };
