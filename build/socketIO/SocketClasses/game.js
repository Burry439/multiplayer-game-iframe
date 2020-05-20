"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = __importDefault(require("./player"));
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.players = [];
        this.bullets = [];
        this.unitySockets = [];
        setInterval(function () {
            _this.bullets.forEach(function (bullet) {
                var isDestroyed = bullet.onUpdate();
                if (isDestroyed) {
                    var index = _this.bullets.indexOf(bullet);
                    if (index > -1) {
                        _this.bullets.splice(index, 1);
                        var returnData_1 = {
                            id: bullet.id,
                        };
                        _this.unitySockets.forEach(function (socket) {
                            socket.emit("serverUnspawn", returnData_1);
                        });
                    }
                }
                else {
                    var returnData_2 = {
                        id: bullet.id,
                        position: {
                            x: bullet.position.x,
                            y: bullet.position.y,
                        }
                    };
                    _this.unitySockets.forEach(function (socket) {
                        socket.emit("updatePosition", returnData_2);
                    });
                }
            });
        }, 100, 0);
    }
    Game.prototype.removePlayer = function (playerId) {
        var _this = this;
        this.players.forEach(function (player, i) {
            if (player.id == playerId) {
                //remove the disconnected player player from players array
                _this.players.splice(i, 1);
            }
        });
    };
    Game.prototype.getPlayers = function () {
        return this.players;
    };
    Game.prototype.getBullets = function () {
        return this.bullets;
    };
    Game.prototype.addUnitySocket = function (socket) {
        this.unitySockets.push(socket);
    };
    Game.prototype.addBullet = function (bullet) {
        this.bullets.push(bullet);
    };
    Game.prototype.getPlayerById = function (playerId) {
        return this.players.find(function (player) {
            return player.id == playerId;
        });
    };
    Game.getGameInstance = function () {
        if (!Game.GameInstance) {
            Game.GameInstance = new Game();
        }
        return Game.GameInstance;
    };
    Game.prototype.isDuplicatePlayer = function (userId) {
        var isDuplicate = false;
        this.players.forEach(function (player) {
            //if we find a duplicate add one to it instance count
            if (player.id == userId) {
                isDuplicate = true;
            }
        });
        return isDuplicate;
    };
    Game.prototype.setPlayerAsDuplicate = function (playerId) {
        this.players.find(function (player) {
            if (player.id == playerId) {
                player.isDuplicate = true;
            }
        });
    };
    Game.prototype.createAndAddNewPlayer = function (username, userId) {
        var newPlayer = new player_1.default(username, userId);
        this.players.push(newPlayer);
        return newPlayer;
    };
    return Game;
}());
exports.default = Game;
//# sourceMappingURL=game.js.map