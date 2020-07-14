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
        //this.unitySockets = []
        this.gameConnections = [];
        this.unityIntervalSocketListener = new unityIntervalSocketListener_1.default(this);
    }
    Game.prototype.getGameConnection = function (roomData) {
        var _gameConnection;
        this.gameConnections.forEach(function (gameConnection) {
            if (gameConnection.roomData.gameName == roomData.gameName && gameConnection.roomData.userId == roomData.userId) {
                _gameConnection = gameConnection;
            }
        });
        return _gameConnection;
    };
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
        this.gameConnections.forEach(function (gameConnection) {
            //if we find a duplicate add one to it instance count
            if (gameConnection.roomData.userId == userId) {
                isDuplicate = true;
            }
        });
        return isDuplicate;
    };
    Game.prototype.addGameConnection = function (gameConnection) {
        this.gameConnections.push(gameConnection);
    };
    Game.prototype.addUnitySocketToGameConnection = function (roomData, socket) {
        var foundIndex = this.gameConnections.findIndex(function (gameConnection) {
            return gameConnection.roomData.gameName == roomData.gameName && gameConnection.unitySocket == null && gameConnection.roomData.userId == roomData.userId;
        });
        if (foundIndex >= 0) {
            this.gameConnections[foundIndex].unitySocket = socket;
        }
    };
    Game.prototype.removeGameConnection = function (userId) {
        var _this = this;
        this.gameConnections.forEach(function (gameConnection, i) {
            if (gameConnection.roomData.userId == userId) {
                //remove the disconnected player player from players array
                _this.gameConnections.splice(i, 1);
            }
        });
    };
    Game.prototype.getGameConnections = function () {
        return this.gameConnections;
    };
    // public setPlayerAsDuplicate(playerId : string) : void{
    //     this.players.find((player : Player) =>{
    //         if(player.id == playerId){
    //             player.isDuplicate = true
    //         }
    //     })
    // }
    Game.prototype.createAndAddNewPlayer = function (username, userId) {
        var newPlayer = new player_1.default(username, userId);
        this.players.push(newPlayer);
        return newPlayer;
    };
    return Game;
}());
exports.default = Game;
//# sourceMappingURL=game.js.map