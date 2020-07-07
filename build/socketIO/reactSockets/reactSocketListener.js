"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReactSocketListener = /** @class */ (function () {
    function ReactSocketListener(_socket, _gameInstance, _roomData) {
        var _this = this;
        this.userId = "0";
        this.socket = _socket;
        this.gameInstance = _gameInstance;
        this.roomData = _roomData;
        if (!this.gameInstance.isDuplicatePlayer(this.roomData.userId)) {
            console.log(this.roomData.gameName + "/" + this.roomData.userId);
            this.socket.join(this.roomData.gameName + "/" + this.roomData.userId);
            this.gameInstance.addGameConnection({
                roomData: {
                    userId: this.roomData.userId,
                    gameName: this.roomData.gameName,
                },
                reactSocket: this.socket,
                unitySocket: null
            });
            this.userId = this.roomData.userId;
            // const newPlayer : Player = this.gameInstance.createAndAddNewPlayer(user.username,user.id)       
            // //tell only sender to first spawn
            // this.socket.emit("reactFirstSpawn", {allPlayers : this.gameInstance.getPlayers(), thisPlayerId : user.id})
            // //tell all other react clients to add new player
            // this.socket.to("react").emit("reactSpawn",  newPlayer)
        }
        else {
            this.socket.emit('isDuplicate');
        }
        // })
        this.socket.on("disconnect", function () {
            console.log("disconnect in react");
            _this.gameInstance.removeGameConnection(_this.userId);
            // if(thisPlayerId != "0"){
            //     this.gameInstance.removePlayer(thisPlayerId)
            //     //tell all other react and unity clients to that user disconnected
            //     this.socket.to("react").emit("disconnectFromReact",thisPlayerId)
            // }
        });
    }
    return ReactSocketListener;
}());
exports.default = ReactSocketListener;
//# sourceMappingURL=reactSocketListener.js.map