"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var counter = 0;
function generateUniqueId(format) {
    if (format === void 0) { format = 'sequential'; }
    if (format === 'uuid') {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            var v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    else {
        return "id_".concat(counter++);
    }
}
exports.default = generateUniqueId;
;
