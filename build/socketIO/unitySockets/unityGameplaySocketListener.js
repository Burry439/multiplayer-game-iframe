"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bullet_1 = __importDefault(require("../SocketClasses/bullet"));
var UnityGameplaySocketListener = /** @class */ (function () {
    function UnityGameplaySocketListener(_socket, _player, _thisPlayerId, _gameInstance) {
        var _this = this;
        this.player = _player;
        this.socket = _socket;
        this.thisPlayerId = _thisPlayerId;
        this.gameInstance = _gameInstance;
        this.socket.on('updateRotation', function (data) {
            _this.player.tankRotation = data.tankRotation;
            _this.player.barrelRotation = data.barrelRotation;
            _this.socket.to("unity").emit("updateRotation", _this.player);
        });
        this.socket.on("updatePosition", function (data) {
            _this.player.position = data.position;
            _this.socket.to("unity").emit("updatePosition", _this.player);
        });
        this.socket.on("collisionDestroy", function (data) {
            var returnBullets = _this.gameInstance.getBullets().filter(function (bullet) {
                return bullet.id == data.id;
            });
            //we will mosst likely only have one entry but just in case loop through all and set destroyed???
            returnBullets.forEach(function (bullet) {
                var playerHit = false;
                var _loop_1 = function (id) {
                    //if we are not not the one who shot
                    if (bullet.activator != id) {
                        var player = _this.gameInstance.getPlayers()[id];
                        var distance = bullet.position.distance(player.position);
                        if (distance < 0.65) {
                            playerHit = true;
                            var isDead = player.dealDamage(50);
                            if (isDead) {
                                var returnData_1 = {
                                    id: player.id,
                                };
                                _this.socket.emit("playerDied", returnData_1);
                                _this.socket.to("unity").emit("playerDied", returnData_1);
                            }
                            else {
                                console.log("player with id: ", player.id, " has: ", player.health, " health left");
                            }
                            var returnData_2 = _this.gameInstance.despawnBullet(bullet);
                            if (returnData_2) {
                                // this.gameInstance.getUnitySocket().forEach(unitySocket => {
                                //     unitySocket.socket.emit("serverUnspawn", returnData)
                                // });
                                _this.gameInstance.getGameConnections().forEach(function (gameConnection) {
                                    gameConnection.unitySocket.emit("serverUnspawn", returnData_2);
                                });
                            }
                        }
                    }
                };
                for (var id in _this.gameInstance.getPlayers()) {
                    _loop_1(id);
                }
                if (!playerHit) {
                    bullet.isDestroyed = true;
                }
            });
        });
        this.socket.on("fireBullet", function (data) {
            var bullet = new bullet_1.default("Bullet", data.activator, data.position, data.direction);
            _this.gameInstance.addBullet(bullet);
            _this.socket.emit("serverSpawn", bullet);
            _this.socket.to("unity").emit("serverSpawn", bullet);
        });
    }
    return UnityGameplaySocketListener;
}());
exports.default = UnityGameplaySocketListener;
//# sourceMappingURL=unityGameplaySocketListener.js.map