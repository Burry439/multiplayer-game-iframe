"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var unityGameplaySocketListener_1 = __importDefault(require("./unityGameplaySocketListener"));
var UnitySocketListener = /** @class */ (function () {
    function UnitySocketListener(_socket, _gameInstance) {
        var _this = this;
        this.socket = _socket;
        this.gameInstance = _gameInstance;
        var thisPlayerId = "0";
        //////////////////For Using With Unity///////////////////////////////
        // this.socket.on("addUnityUser",() =>{
        //     this.socket.join("unity")
        //     this.gameInstance.addUnitySocket({playerId : thisPlayerId, socket : this.socket});
        //     const id = Math.floor((Math.random() * 100) + 1);
        //     thisPlayerId = id.toString()
        //     this.player = this.gameInstance.createAndAddNewPlayer("test",id.toString())       
        //     //tell sender to regeister
        //     this.socket.join("unity")
        //     if(this.player &&  this.player.connectedToUnity == false){
        //         thisPlayerId = this.player.id
        //         this.player.connectedToUnity = true
        //         //set unity gameplay listener
        //         new UnityGameplaySocketListener(this.socket,this.player,thisPlayerId,this.gameInstance)
        //         new UnityIntervalSocketListener(this.socket,this.gameInstance)
        //         //tell sender to regeister
        //         this.socket.emit("register", this.player)
        //         //tell others in unity room to spawn new player
        //         this.socket.to("unity").emit("spawn", this.player)
        //         //add all players
        //         this.gameInstance.getPlayers().forEach((player : Player) =>{  
        //              // tell sender to spawn all other unity players
        //             this.socket.emit("spawn",player)
        //          })
        //          // add all bullets
        //          this.gameInstance.getBullets().forEach((bullet : Bullet) =>{  
        //             // tell sender to spawn all other unity players
        //             this.socket.emit("serverSpawn",bullet)
        //         })
        //      }
        //      else{
        //          console.log("no free usersss")
        //          //tell sender he is a duplicate
        //          this.socket.emit("duplicatePlayer")
        //      }
        // })
        //////////////////For testing on unity///////////////////////////////
        //////////////////For Using with React///////////////////////////////
        this.socket.on("addUnityUser", function () {
            console.log("add unity user");
            //join unity room
            _this.socket.join("unity");
            _this.gameInstance.getPlayers().forEach(function (player) {
                if (player.connectedToUnity == false) {
                    _this.player = player;
                }
            });
            if (_this.player && _this.player.connectedToUnity == false) {
                console.log("on that if");
                thisPlayerId = _this.player.id;
                _this.gameInstance.addUnitySocket({ playerId: thisPlayerId, socket: _this.socket });
                _this.player.connectedToUnity = true;
                //set unity gameplay listener
                new unityGameplaySocketListener_1.default(_this.socket, _this.player, thisPlayerId, _this.gameInstance);
                //tell sender to regeister
                _this.socket.emit("register", _this.player);
                //tell others in unity room to spawn new player
                _this.socket.to("unity").emit("spawn", _this.player);
                _this.gameInstance.getPlayers().forEach(function (player) {
                    // tell sender to spawn all other unity players
                    _this.socket.emit("spawn", player);
                });
                _this.gameInstance.getBullets().forEach(function (bullet) {
                    // tell sender to spawn all other unity players
                    _this.socket.emit("serverSpawn", bullet);
                });
            }
            else {
                console.log("no free usersss");
                //tell sender he is a duplicate
                _this.socket.emit("duplicatePlayer");
            }
        });
        //////////////////For Deploying///////////////////////////////
        this.socket.on("disconnect", function () {
            console.log("disconnect in unity");
            console.log(_this.player);
            //when this gets called from react thisPlayerId will be "0"
            if (thisPlayerId != "0") {
                _this.gameInstance.removePlayer(thisPlayerId);
                _this.gameInstance.removeUnitySocket(thisPlayerId);
                console.log(_this.gameInstance.getUnitySocket());
                //tell all other react and unity clients to that user disconnected
                _this.socket.broadcast.emit("disconnectFromUnity", _this.player);
            }
        });
        var interval = function (func, wait, times) {
            var interv = function (w, t) {
                return function () {
                    if (typeof t === "undefined" || t-- > 0) {
                        setTimeout(interv, w);
                        try {
                            func.call(null);
                        }
                        catch (e) {
                            t = 0;
                            throw e.toString();
                        }
                    }
                };
            };
            interv(wait, times);
            setTimeout(interv, wait);
        };
    }
    return UnitySocketListener;
}());
exports.default = UnitySocketListener;
//# sourceMappingURL=unitySocketListener.js.map