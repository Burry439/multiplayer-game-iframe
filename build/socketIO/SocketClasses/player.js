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
        this.position = new vector2_1.default(),
            this.tankRotation = 0;
        this.barrelRotation = 0;
        this.health = 100;
        this.isDead = false;
        this.respawnTicker = 0;
        this.respawnTime = 0;
        this.connectedToUnity = false;
        this.isDuplicate = false;
    }
    Player.prototype.respawnCounter = function () {
        this.respawnTicker += 1;
        if (this.respawnTicker >= 10) {
            this.respawnTicker = 0;
            this.respawnTime += 1;
            if (this.respawnTime >= 3) {
                console.log("Respawn Player id:", this.id);
                this.isDead = false;
                this.respawnTicker = 0;
                this.respawnTime = 0;
                this.health = 100;
                this.position = new vector2_1.default(0, 0);
                return true;
            }
        }
        return false;
    };
    Player.prototype.dealDamage = function (amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.isDead = true;
            this.respawnTicker = 0;
            this.respawnTime = 0;
        }
        return this.isDead;
    };
    return Player;
}());
exports.default = Player;
//# sourceMappingURL=player.js.map