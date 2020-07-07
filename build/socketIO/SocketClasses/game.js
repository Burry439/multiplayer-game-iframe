"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = __importDefault(require("./player"));
var unityIntervalSocketListener_1 = __importDefault(require("../unitySockets/unityIntervalSocketListener"));
var Game = /** @class */ (function () {
    function Game() {
        this.players = [];
        this.bullets = [];
        this.unitySockets = [];
        this.unityIntervalSocketListener = new unityIntervalSocketListener_1.default(this);
    }
    Game.prototype.despawnBullet = function (bullet) {
        console.log("destroy bullet: ", bullet.id);
        var index = this.bullets.indexOf(bullet);
        if (index > -1) {
            this.bullets.splice(index, 1);
            var returnData = {
                id: bullet.id,
            };
            return returnData;
        }
    };
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
    Game.prototype.removeUnitySocket = function (playerId) {
        var _this = this;
        this.unitySockets.forEach(function (unitySocket, i) {
            if (unitySocket.playerId == playerId) {
                //remove the disconnected player player from players array
                _this.unitySockets.splice(i, 1);
            }
        });
    };
    Game.prototype.getUnitySocket = function () {
        return this.unitySockets;
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