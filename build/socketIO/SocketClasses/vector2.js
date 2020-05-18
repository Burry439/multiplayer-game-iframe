"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = 0;
        this.y = 0;
        this.x = x,
            this.y = y;
    }
    Vector2.prototype.magnitude = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };
    Vector2.prototype.normalized = function () {
        var mag = this.magnitude();
        return new Vector2(this.x / mag, this.y / mag);
    };
    Vector2.prototype.distance = function (otherVect) {
        var direction = new Vector2();
        direction.x = otherVect.x - this.x;
        direction.y = otherVect.y - this.y;
        return direction.magnitude();
    };
    Vector2.prototype.consoleOutput = function () {
        return '( ' + this.x + ' , ' + this.y + ' ) ';
    };
    return Vector2;
}());
exports.default = Vector2;
//# sourceMappingURL=vector2.js.map