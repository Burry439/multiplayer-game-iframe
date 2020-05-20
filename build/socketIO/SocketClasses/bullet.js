"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vector2_1 = __importDefault(require("./vector2"));
var serverObject_1 = __importDefault(require("./serverObject"));
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super.call(this) || this;
        _this.direction = new vector2_1.default();
        _this.speed = 0.5;
        _this.isDestroyed = false;
        _this.activator = '';
        return _this;
    }
    Bullet.prototype.onUpdate = function () {
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;
        return this.isDestroyed;
    };
    return Bullet;
}(serverObject_1.default));
exports.default = Bullet;
//# sourceMappingURL=bullet.js.map