"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiContext = void 0;
const react_1 = require("react");
exports.ApiContext = react_1.createContext({
    api: '',
    baseURL: ''
});
