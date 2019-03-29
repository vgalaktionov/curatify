"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
exports.default = ({ icon, size }) => {
    return (React.createElement("span", { className: "icon" },
        React.createElement("i", { className: icon })));
};
//# sourceMappingURL=Icon.js.map