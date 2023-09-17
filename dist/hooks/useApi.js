"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApi = void 0;
const react_1 = require("react");
const ApiContext_1 = require("../context/ApiContext");
const useApi = () => {
    const { api } = react_1.useContext(ApiContext_1.ApiContext);
    return {
        api
    };
};
exports.useApi = useApi;
