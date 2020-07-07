"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReactSocketListener = /** @class */ (function () {
    function ReactSocketListener(_socket, _gameInstance) {
        var _this = this;
        this.socket = _socket;
        this.gameInstance = _gameInstance;
        var thisPlayerId = "0";
        this.socket.on("addReactUser", function (user) {
            //add user to react room
            _this.socket.join("react");
            //has this user been added already
            if (!_this.gameInstance.isDuplicatePlayer(user.id)) {
                thisPlayerId = user.id;
                var newPlayer = _this.gameInstance.createAndAddNewPlayer(user.username, user.id);
                //tell only sender to first spawn
                _this.socket.emit("reactFirstSpawn", { allPlayers: _this.gameInstance.getPlayers(), thisPlayerId: user.id });
                //tell all other react clients to add new player
                _this.socket.to("react").emit("reactSpawn", newPlayer);
            }
            else {
                //if its a duplicate add one to its instance count 
                _this.gameInstance.setPlayerAsDuplicate(user.id);
                //tell only sender to add duplicate
                _this.socket.emit("duplicatePlayer", user.id);
            }
        });
        this.socket.on("disconnect", function () {
            console.log("disconnect in react");
            //when called from unity thisPlayerId will be "0"
            if (thisPlayerId != "0") {
                _this.gameInstance.removePlayer(thisPlayerId);
                //tell all other react and unity clients to that user disconnected
                _this.socket.to("react").emit("disconnectFromReact", thisPlayerId);
            }
        });
    }
    return ReactSocketListener;
}());
exports.default = ReactSocketListener;
//# sourceMappingURL=reactSocketListener.js.map