"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnitySocketListener = /** @class */ (function () {
    function UnitySocketListener(_socket, _gameInstance) {
        var _this = this;
        this.socket = _socket;
        this.gameInstance = _gameInstance;
        var thisPlayerId = "0";
        //for testing 
        // this.socket.on("addUnityUser",() =>{
        //     const id = Math.floor((Math.random() * 100) + 1);
        //     thisPlayerId = id.toString()
        //     const newPlayer : Player = this.gameInstance.createAndAddNewPlayer("test",id.toString())       
        //     //tell sender to regeister
        //     this.socket.emit("register", this.player)
        //     this.socket.join("unity")
        //     this.socket.to("unity").emit("spawn",newPlayer)
        //     this.gameInstance.getPlayers().forEach((player : Player) =>{  
        //         // tell sender to spawn all other unity players
        //         this.socket.emit("spawn",player)
        //     })
        // })
        //
        this.socket.on("addUnityUser", function () {
            //join unity room
            _this.socket.join("unity");
            _this.gameInstance.getPlayers().forEach(function (player) {
                if (player.connectedToUnity == false) {
                    _this.player = player;
                }
            });
            if (_this.player && _this.player.connectedToUnity == false) {
                thisPlayerId = _this.player.id;
                _this.player.connectedToUnity = true;
                //tell sender to regeister
                _this.socket.emit("register", _this.player);
                //tell others in unity room to spawn new player
                _this.socket.to("unity").emit("spawn", _this.player);
                _this.gameInstance.getPlayers().forEach(function (player) {
                    // tell sender to spawn all other unity players
                    _this.socket.emit("spawn", player);
                });
            }
            else {
                console.log("no free usersss");
                //tell sender he is a duplicate
                _this.socket.emit("duplicatePlayer");
            }
        });
        this.socket.on("disconnect", function () {
            console.log("disconnect in unity");
            console.log(_this.player);
            //when this gets called from react thisPlayerId will be "0"
            if (thisPlayerId != "0") {
                //tell all other react and unity clients to that user disconnected
                _this.socket.broadcast.emit("disconnectFromUnity", _this.player);
            }
        });
        this.socket.on("updatePosition", function (data) {
            _this.player.position.x = data.position.x;
            _this.player.position.y = data.position.y;
            _this.socket.to("unity").emit("updatePosition", _this.player);
        });
    }
    return UnitySocketListener;
}());
exports.default = UnitySocketListener;
//# sourceMappingURL=unitySocketListener.js.map