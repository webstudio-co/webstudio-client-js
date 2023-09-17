"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = exports.ApiClient = void 0;
const ApiQuery_1 = require("./ApiQuery");
const RestClient_1 = require("./RestClient");
class ApiClient {
    constructor(baseURL, fetchToken, apiKey = null, authToken = null) {
        this.apiQuery = new ApiQuery_1.ApiQuery();
        this.restClient = new RestClient_1.RestClient(baseURL, fetchToken, apiKey, authToken);
        this.payload = {};
        this.headers = {
            'Content-Type': 'application/json',
        };
        this._path = '';
        this._collection = '';
        this.endpoint = '';
        return new Proxy(this, {
            get(target, prop) {
                if (typeof target[prop] !== 'undefined') {
                    return target[prop];
                }
                target._collection = prop === null || prop === void 0 ? void 0 : prop.toString();
                target._path = `/${prop === null || prop === void 0 ? void 0 : prop.toString()}`;
                return target;
            },
        });
    }
    // Manually set the collection params
    config(params) {
        if (typeof params !== 'object') {
            throw Error('Collection must be an object');
        }
        this.setDefaults();
        const { collection, path } = params;
        if (typeof collection === 'string') {
            this._collection = collection;
        }
        if (typeof path === 'string') {
            this._path = path;
        }
        return this;
    }
    url(path) {
        this._path = path;
        return this;
    }
    collection(collection) {
        this.setDefaults();
        this._collection = collection;
        return this;
    }
    setDefaults() {
        this._collection = '';
        this._path = '';
        this.payload = {};
        this.apiQuery = new ApiQuery_1.ApiQuery();
        return this;
    }
    query(params) {
        this.apiQuery = new ApiQuery_1.ApiQuery(params);
        return this;
    }
    eq(field, value) {
        this.apiQuery.eq(field, value);
        return this;
    }
    neq(field, value) {
        this.apiQuery.neq(field, value);
        return this;
    }
    gt(field, value) {
        this.apiQuery.gt(field, value);
        return this;
    }
    gte(field, value) {
        this.apiQuery.gte(field, value);
        return this;
    }
    lt(field, value) {
        this.apiQuery.lt(field, value);
        return this;
    }
    lte(field, value) {
        this.apiQuery.lte(field, value);
        return this;
    }
    in(field, value) {
        this.apiQuery.in(field, value);
        return this;
    }
    nin(field, value) {
        this.apiQuery.nin(field, value);
        return this;
    }
    sort(field, direction) {
        this.apiQuery.sort(field, direction);
        return this;
    }
    search(query) {
        this.apiQuery.search(query);
        return this;
    }
    filter(filters) {
        this.apiQuery.filter(filters);
        return this;
    }
    page(page) {
        this.apiQuery.page = page;
        return this;
    }
    per(perPage) {
        this.apiQuery.per_page = perPage;
        return this;
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.endpoint = `${this._path}/${id}`;
            return yield this.restClient.get(this.endpoint);
        });
    }
    findMany(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            this.apiQuery.where(searchParams);
            this.endpoint = this._path;
            return yield this.restClient.get(this.endpoint || '', this.apiQuery.url());
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = data;
            this.handleMultipartData();
            this.endpoint = this._path;
            return yield this.restClient.post(this._path || '', this.payload, this.headers);
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = data;
            this.handleMultipartData();
            this.endpoint = `${this._path}/${data.id}`;
            return yield this.restClient.put(this.endpoint, this.payload, this.headers);
        });
    }
    destroy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.endpoint = `${this._path}/${id}`;
            return yield this.restClient.delete(this.endpoint);
        });
    }
    updatePositions(sorted) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = {
                ids: sorted.map((resource) => resource.id),
                positions: sorted.map((_, index) => index),
            };
            this.endpoint = `${this._path}/update_positions`;
            return yield this.restClient.post(this.endpoint, this.payload);
        });
    }
    updateMany(ids, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = {
                ids: ids,
                resoure: resource,
            };
            this.endpoint = `${this._path}/update_many`;
            return yield this.restClient.post(this.endpoint, this.payload);
        });
    }
    destroyMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(ids)) {
                throw Error('Ids must be an array');
            }
            this.payload = {
                ids: ids,
            };
            this.endpoint = `${this._path}/delete_many`;
            return yield this.restClient.post(this.endpoint, this.payload);
        });
    }
    publish(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.endpoint = `${this._path}/${id}/publish`;
            return yield this.restClient.post(this.endpoint);
        });
    }
    unpublish(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.endpoint = `${this._path}/${id}/unpublish`;
            return yield this.restClient.post(this.endpoint);
        });
    }
    addLinks(sourceId, contentType, targetIds) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = {
                [this._collection]: {
                    content_type: contentType,
                    ids: targetIds,
                },
            };
            this.endpoint = `${this._path}/${sourceId}/add_links`;
            return yield this.restClient.post(this.endpoint, this.payload);
        });
    }
    removeLinks(sourceId, targetIds) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = {
                [this._collection]: {
                    ids: targetIds,
                },
            };
            this.endpoint = `${this._path}/${sourceId}/remove_links`;
            return yield this.restClient.post(this.endpoint, this.payload);
        });
    }
    addAttachment(id, name, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = {
                [this._collection]: {
                    name: name,
                    id: attachmentId,
                },
            };
            this.endpoint = `${this._path}/${id}/add_attachment`;
            return yield this.restClient.post(this.endpoint, this.payload);
        });
    }
    removeAttachment(id, name, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = {
                [this._collection]: {
                    name: name,
                    id: attachmentId,
                },
            };
            this.endpoint = `${this._path}/${id}/remove_attachment`;
            return yield this.restClient.post(this.endpoint, this.payload);
        });
    }
    parseURL(routerParams) {
        this.apiQuery.parseURL(routerParams);
        return this;
    }
    get(endpoint, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.endpoint = endpoint;
            return yield this.restClient.get(this.endpoint, params);
        });
    }
    post(endpoint, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = payload;
            this.endpoint = endpoint;
            this.handleMultipartData();
            return yield this.restClient.post(this.endpoint, this.payload, this.headers);
        });
    }
    put(endpoint, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = payload;
            this.endpoint = endpoint;
            this.handleMultipartData();
            return yield this.restClient.put(this.endpoint, this.payload, this.headers);
        });
    }
    delete(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            this.endpoint = endpoint;
            return yield this.restClient.delete(this.endpoint);
        });
    }
    // Check if payload contains a File object
    // and create FormData and set headers if it does
    handleMultipartData() {
        for (const key in this.payload) {
            if (this.payload[key] instanceof File) {
                const formData = new FormData();
                for (const formKey in this.payload) {
                    formData.append(`${this._collection}[${formKey}]`, this.payload[formKey]);
                }
                this.payload = formData;
                this.headers['Content-Type'] = 'multipart/form-data';
                break;
            }
        }
    }
}
exports.ApiClient = ApiClient;
const createClient = (baseURL, fetchToken, apiKey = null, authToken = null) => {
    return new ApiClient(baseURL, fetchToken, apiKey, authToken);
};
exports.createClient = createClient;
