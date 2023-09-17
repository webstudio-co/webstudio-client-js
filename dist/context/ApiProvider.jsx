"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiProvider = void 0;
const react_1 = __importDefault(require("react"));
const ApiContext_1 = require("./ApiContext");
const ApiClient_1 = require("../api/ApiClient");
const ApiProvider = (props) => {
    const { url, fetchToken, children } = props;
    const baseURL = url;
    const api = ApiClient_1.createClient(baseURL, fetchToken);
    const value = {
        api,
        baseURL
    };
    return (<ApiContext_1.ApiContext.Provider value={value}>
			{children}
		</ApiContext_1.ApiContext.Provider>);
};
exports.ApiProvider = ApiProvider;
exports.default = exports.ApiProvider;
