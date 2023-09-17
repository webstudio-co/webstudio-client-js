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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClient = void 0;
const axios_1 = __importDefault(require("axios"));
class RestClient {
    constructor(baseURL = null, fetchToken, apiKey = null, authToken = null) {
        this.method = 'GET';
        this.payload = null;
        this.authToken = authToken;
        this.apiKey = apiKey;
        this.params = null;
        this.fetchToken = fetchToken;
        this.options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            data: this.payload,
        };
        this.baseURL = baseURL;
    }
    get(endpoint, params, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            this.method = 'GET';
            this.params = params;
            this.options.headers = headers || this.options.headers;
            return yield this.execute(endpoint);
        });
    }
    put(endpoint, payload, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            this.method = 'PUT';
            this.payload = payload;
            this.options.headers = headers;
            return yield this.execute(endpoint);
        });
    }
    post(endpoint, payload, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            this.method = 'POST';
            this.payload = payload;
            this.options.headers = headers || this.options.headers;
            return yield this.execute(endpoint);
        });
    }
    delete(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            this.method = 'DELETE';
            return yield this.execute(endpoint);
        });
    }
    execute(endpoint = '') {
        return __awaiter(this, void 0, void 0, function* () {
            let response = {
                data: null,
                error: null,
            };
            this.authToken = this.authToken || this.fetchToken();
            if (this.authToken) {
                this.options.headers['Authorization'] = `Bearer ${this.authToken}`;
            }
            else if (this.apiKey) {
                this.options.headers['Access-Token'] = this.apiKey;
            }
            let url = `${this.baseURL}${endpoint}`;
            if (this.params && this.method == 'GET') {
                url += '?' + this.params;
            }
            this.options = Object.assign(Object.assign({}, this.options), { method: this.method });
            if (this.method === 'POST' || this.method === 'PUT') {
                this.options = Object.assign(Object.assign({}, this.options), { data: this.payload, method: this.method });
            }
            try {
                const fetchResponse = yield axios_1.default(Object.assign({ url }, this.options));
                const resp = yield (fetchResponse === null || fetchResponse === void 0 ? void 0 : fetchResponse.data);
                response.data = resp === null || resp === void 0 ? void 0 : resp.data;
            }
            catch (error) {
                response.error = error;
            }
            return response;
        });
    }
}
exports.RestClient = RestClient;
