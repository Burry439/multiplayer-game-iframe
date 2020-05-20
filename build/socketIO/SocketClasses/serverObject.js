"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vector2_1 = __importDefault(require("./vector2"));
//import ShortUniqueId from 'short-unique-id';
var ServerObjects = /** @class */ (function () {
    function ServerObjects() {
        this.id = Math.floor((Math.random() * 100000) + 1).toString();
        this.name = "ServerObject";
        this.position = new vector2_1.default();
        console.log(this.id);
    }
    return ServerObjects;
}());
exports.default = ServerObjects;
//# sourceMappingURL=serverObject.js.map