"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPrefix = exports.resetId = void 0;
var globalPrefix = "id";
var lastId = 0;
function nextId(localPrefix) {
    lastId++;
    return "".concat(localPrefix || globalPrefix).concat(lastId);
}
exports.default = nextId;
var resetId = function () {
    lastId = 0;
};
exports.resetId = resetId;
var setPrefix = function (newPrefix) {
    globalPrefix = newPrefix;
};
exports.setPrefix = setPrefix;
