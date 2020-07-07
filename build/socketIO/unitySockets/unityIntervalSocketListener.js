"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnityIntervalSocketListener = /** @class */ (function () {
    function UnityIntervalSocketListener(_gameInstance) {
        var _this = this;
        console.log(_gameInstance);
        this.gameInstance = _gameInstance;
        UnityIntervalSocketListener.interval = setInterval(function () {
            _this.gameInstance.getBullets().forEach(function (bullet) {
                var isDestroyed = bullet.onUpdate();
                if (isDestroyed) {
                    var returnData_1 = _this.gameInstance.despawnBullet(bullet);
                    //should we remove a bullet
                    if (returnData_1) {
                        _this.gameInstance.getUnitySocket().forEach(function (unitySocket) {
                            unitySocket.socket.emit("serverUnspawn", returnData_1);
                        });
                    }
                }
                else {
                    var returnData = {
                        id: bullet.id,
                        position: bullet.position
                    };
                    for (var playerId in _this.gameInstance.getPlayers()) {
                        // since this is in an interval our data might not be in sync 
                        if (_this.gameInstance.getUnitySocket()[playerId]) {
                            _this.gameInstance.getUnitySocket()[playerId].socket.emit("updatePosition", returnData);
                        }
                    }
                }
            });
            for (var id in _this.gameInstance.getPlayers()) {
                var player = _this.gameInstance.getPlayers()[id];
                if (player.isDead) {
                    var isRespawn = player.respawnCounter();
                    if (isRespawn) {
                        var returnData = {
                            id: player.id,
                            position: player.position
                        };
                        _this.gameInstance.getUnitySocket()[id].socket.emit("playerRespawn", returnData);
                        _this.gameInstance.getUnitySocket()[id].socket.to("unity").emit("playerRespawn", returnData);
                    }
                }
            }
        }, 100, 0);
    }
    return UnityIntervalSocketListener;
}());
exports.default = UnityIntervalSocketListener;
//# sourceMappingURL=unityIntervalSocketListener.js.map