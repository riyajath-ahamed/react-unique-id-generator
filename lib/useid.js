"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var nextId_1 = __importDefault(require("./nextId"));
var getIds = function (count, prefix) {
    var ids = [];
    for (var i = 0; i < count; i++) {
        ids.push((0, nextId_1.default)(prefix));
    }
    return ids;
};
function usePrevious(value) {
    var ref = react_1.default.useRef();
    react_1.default.useEffect(function () {
        ref.current = value;
    });
    return ref.current;
}
function useId(count, prefix) {
    if (count === void 0) { count = 1; }
    var idsListRef = react_1.default.useRef([]);
    var prevCount = usePrevious(count);
    var prevPrefix = usePrevious(prefix);
    if (count !== prevCount || prevPrefix !== prefix) {
        idsListRef.current = getIds(count, prefix);
    }
    return idsListRef.current;
}
exports.default = useId;
