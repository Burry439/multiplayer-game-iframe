"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vector2_1 = __importDefault(require("./vector2"));
var Player = /** @class */ (function () {
    function Player(_username, _id) {
        this.id = _id;
        this.username = _username;
        this.position = new vector2_1.default();
        this.connectedToUnity = false,
            this.isDuplicate = false;
    }
    return Player;
}());
exports.default = Player;
//# sourceMappingURL=player.js.map