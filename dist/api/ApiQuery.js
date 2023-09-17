"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiQuery = void 0;
class ApiQuery {
    constructor(params = {}) {
        this.isValidFilter = (filter) => {
            if (typeof filter !== 'object') {
                return false;
            }
            let operator = Object.keys(filter)[0];
            let value = filter[operator];
            return (typeof filter === 'object' &&
                operator !== null &&
                operator !== '' &&
                operator !== undefined &&
                value !== null &&
                value !== '' &&
                value !== undefined);
        };
        const { sort_by, sort_direction, keywords, filters, page = 1, per_page = 20, } = params;
        this._sort_by = sort_by || 'id';
        this._sort_direction = sort_direction || 'desc';
        this._keywords = keywords;
        this._filters = filters || {
            AND: [],
            OR: [],
        };
        this._page = page;
        this._per_page = per_page;
    }
    set page(value) {
        if (typeof value === 'number' && value > 0) {
            this._page = value;
        }
        else {
            throw new Error('Page must be a positive number.');
        }
    }
    set per_page(value) {
        if (typeof value === 'number' && value > 0) {
            this._per_page = value;
        }
        else {
            throw new Error('Per_page must be a positive number.');
        }
    }
    get page() {
        return this._page;
    }
    get per_page() {
        return this._per_page;
    }
    set keywords(value) {
        if (typeof value === 'string') {
            this._keywords = value;
        }
        else {
            throw new Error('Keywords must be a string.');
        }
    }
    get keywords() {
        return this._keywords || '';
    }
    get filters() {
        return this._filters;
    }
    set filters(value) {
        if (typeof value === 'object') {
            this._filters = value;
        }
        else {
            throw new Error('Filters must be an object.');
        }
    }
    get sort_by() {
        return this._sort_by;
    }
    set sort_by(value) {
        if (typeof value === 'string') {
            this._sort_by = value;
        }
        else {
            throw new Error('Sort_by must be a string.');
        }
    }
    set sort_direction(value) {
        if (typeof value === 'string') {
            this._sort_direction = value;
        }
        else {
            throw new Error('Sort_direction must be a string.');
        }
    }
    get sort_direction() {
        return this._sort_direction;
    }
    where(searchParams) {
        let { sort_by = 'id', sort_direction = 'desc', keywords, filters, page = 1, per_page = 20, } = searchParams || {};
        this.transformFilterArray(filters);
        this._sort_by = sort_by || this._sort_by;
        this._sort_direction =
            sort_direction || this._sort_direction;
        this._keywords = keywords || this._keywords;
        this._filters = filters || this._filters;
        this._page = page || this._page;
        this._per_page = per_page || this._per_page;
        return this;
    }
    filter(filters) {
        this._filters = filters;
        return this;
    }
    sort(field, direction = null) {
        if (field === this.sort_by && !direction) {
            if (this._sort_direction === 'asc') {
                this._sort_direction = 'desc';
            }
            else {
                this._sort_direction = 'asc';
            }
        }
        else {
            this._sort_by = field;
            this._sort_direction = direction || 'asc';
        }
        return this;
    }
    search(query) {
        this._keywords = query;
        return this;
    }
    eq(field, value) {
        this.AND_filter({ [field]: { eq: value } });
        return this;
    }
    neq(field, value) {
        this.AND_filter({ [field]: { neq: value } });
        return this;
    }
    gt(field, value) {
        this.AND_filter({ [field]: { gt: value } });
        return this;
    }
    gte(field, value) {
        this.AND_filter({ [field]: { gte: value } });
        return this;
    }
    lt(field, value) {
        this.AND_filter({ [field]: { lt: value } });
        return this;
    }
    lte(field, value) {
        this.AND_filter({ [field]: { lte: value } });
        return this;
    }
    in(field, value) {
        this.AND_filter({ [field]: { in: value } });
        return this;
    }
    nin(field, value) {
        this.AND_filter({ [field]: { nin: value } });
        return this;
    }
    orEq(field, value) {
        this.OR_filter({ [field]: { eq: value } });
        return this;
    }
    orNeq(field, value) {
        this.OR_filter({ [field]: { neq: value } });
        return this;
    }
    orLt(field, value) {
        this.OR_filter({ [field]: { lt: value } });
        return this;
    }
    orLte(field, value) {
        this.OR_filter({ [field]: { lte: value } });
        return this;
    }
    orGt(field, value) {
        this.OR_filter({ [field]: { gt: value } });
        return this;
    }
    orGte(field, value) {
        this.OR_filter({ [field]: { gte: value } });
        return this;
    }
    orIn(field, value) {
        this.OR_filter({ [field]: { in: value } });
        return this;
    }
    orNin(field, value) {
        this.OR_filter({ [field]: { nin: value } });
        return this;
    }
    AND_filter(filter) {
        this._filters = Object.assign(Object.assign({}, this._filters), { AND: [...(this._filters['AND'] || []), filter] });
        return this;
    }
    OR_filter(filter) {
        this._filters = Object.assign(Object.assign({}, this._filters), { OR: [...(this._filters['OR'] || []), filter] });
        return this;
    }
    url() {
        let searchParams = {
            page: this._page || 1,
            per_page: this._per_page || 20,
        };
        if (this._sort_by && this._sort_direction) {
            searchParams = Object.assign(Object.assign({}, searchParams), { order: `${this._sort_by}:${this._sort_direction}` });
        }
        if (this._keywords && this._keywords.length > 0) {
            searchParams = Object.assign(Object.assign({}, searchParams), { keywords: this._keywords });
        }
        let andFilters = [];
        let orFilters = [];
        if (typeof this._filters === 'object' &&
            Object.keys(this._filters).length > 0) {
            Object.keys(this._filters).forEach((where) => {
                let andOrfilters = this._filters[where];
                andOrfilters === null || andOrfilters === void 0 ? void 0 : andOrfilters.forEach((filter) => {
                    if (this.isValidFilter(filter)) {
                        let field = Object.keys(filter)[0];
                        let operator = Object.keys(filter[field])[0];
                        //@ts-ignore
                        let value = filter[field][operator];
                        if (Array.isArray(value)) {
                            value = `[${value.join(',')}]`;
                        }
                        if (where == 'AND') {
                            andFilters.push(`${field}:${operator}:${value}`);
                        }
                        if (where == 'OR') {
                            orFilters.push(`${field}:${operator}:${value}`);
                        }
                    }
                });
            });
        }
        let andOrFilters = [];
        if (andFilters.length > 0) {
            andOrFilters.push(`and(${andFilters.join(',')})`);
        }
        if (orFilters.length > 0) {
            andOrFilters.push(`or(${orFilters.join(',')})`);
        }
        searchParams = Object.assign(Object.assign({}, searchParams), { filters: andOrFilters.join('') });
        let url = [];
        for (let key in searchParams) {
            //@ts-ignore
            if (searchParams[key]) {
                //@ts-ignore
                url.push(`${key}=${searchParams[key]}`);
            }
        }
        return url.join('&');
    }
    parseURL(routerParams = {}) {
        const { keywords, page, per_page, filters: filterParams, order, } = routerParams;
        let [sort_by, sort_direction] = order
            ? order.split(':')
            : [];
        let filters = {};
        // Split the string into "AND" and "OR" parts
        if (filterParams) {
            const andPart = filterParams.match(/and\((.*?)\)/);
            let andFilterArray = [];
            const orPart = filterParams.match(/or\((.*?)\)$/);
            let orFilterArray = [];
            // Parse AND filters
            if (andPart) {
                let andFilters = andPart[1];
                andFilterArray = andFilters
                    .split(',')
                    //@ts-ignore
                    .map((filter) => {
                    const [field, operator, value] = filter.split(':');
                    return {
                        [field]: { [operator]: value },
                    };
                });
                filters = Object.assign(Object.assign({}, filters), { AND: andFilterArray });
            }
            // Parse OR filters
            if (orPart) {
                let orFilters = orPart[1];
                orFilterArray = orFilters
                    .split(',')
                    .map((filter) => {
                    const [field, operator, value] = filter.split(':');
                    return {
                        [field]: { [operator]: value },
                    };
                });
                filters = Object.assign(Object.assign({}, filters), { OR: orFilterArray });
            }
        }
        this._keywords = keywords || '';
        this._page = page || 1;
        this._per_page = per_page || 20;
        this._sort_by = sort_by || 'id';
        this._sort_direction = sort_direction || 'desc';
        this._filters = filters || {};
        return this;
    }
    transformFilterArray(filters) {
        if (Array.isArray(filters)) {
            for (const filter of filters) {
                const { where, field, operator, value } = filter;
                if (where !== 'AND' && where !== 'OR') {
                    throw new Error('Filter must include AND or OR.');
                }
                if (where === 'AND') {
                    this.AND_filter({
                        [field]: { [operator]: value },
                    });
                }
                if (where === 'OR') {
                    this.OR_filter({
                        [field]: { [operator]: value },
                    });
                }
            }
        }
    }
    query() {
        return {
            keywords: this._keywords,
            page: this._page,
            per_page: this._per_page,
            sort_by: this._sort_by,
            sort_direction: this._sort_direction,
            filters: this._filters,
        };
    }
}
exports.ApiQuery = ApiQuery;
