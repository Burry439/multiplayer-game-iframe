"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bullet_1 = __importDefault(require("./SocketClasses/bullet"));
var UnitySocketListener = /** @class */ (function () {
    function UnitySocketListener(_socket, _gameInstance) {
        var _this = this;
        this.socket = _socket;
        this.gameInstance = _gameInstance;
        var thisPlayerId = "0";
        //For testing on unity
        // this.socket.on("addUnityUser",() =>{
        //     this.socket.join("unity")
        //     this.gameInstance.addUnitySocket(this.socket);
        //     const id = Math.floor((Math.random() * 100) + 1);
        //     thisPlayerId = id.toString()
        //     this.player = this.gameInstance.createAndAddNewPlayer("test",id.toString())       
        //     //tell sender to regeister
        //     this.socket.join("unity")
        //     if(this.player &&  this.player.connectedToUnity == false){
        //         thisPlayerId = this.player.id
        //          this.player.connectedToUnity = true
        //          //tell sender to regeister
        //          this.socket.emit("register", this.player)
        //         //tell others in unity room to spawn new player
        //         this.socket.to("unity").emit("spawn", this.player)
        //         //add all players
        //          this.gameInstance.getPlayers().forEach((player : Player) =>{  
        //              // tell sender to spawn all other unity players
        //              this.socket.emit("spawn",player)
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
        //For testing on unity
        //  for deploying
        this.socket.on("addUnityUser", function () {
            //join unity room
            _this.socket.join("unity");
            _this.gameInstance.getPlayers().forEach(function (player) {
                if (player.connectedToUnity == false) {
                    _this.player = player;
                }
            });
            if (_this.player && _this.player.connectedToUnity == false) {
                _this.gameInstance.addUnitySocket(_this.socket);
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
        //  for deploying
        //For testing on unity
        // this.socket.on("disconnect", () =>{
        //     console.log("disconnect in unity")
        //     console.log(this.player)
        //     this.gameInstance.removePlayer(thisPlayerId)
        //     //when this gets called from react thisPlayerId will be "0"
        //     if(thisPlayerId != "0"){
        //          //tell all other react and unity clients to that user disconnected
        //         this.socket.broadcast.emit("disconnectFromUnity",this.player)
        //     }        
        // })
        //For testing on unity
        //for deploying
        this.socket.on("disconnect", function () {
            console.log("disconnect in unity");
            console.log(_this.player);
            //when this gets called from react thisPlayerId will be "0"
            if (thisPlayerId != "0") {
                //tell all other react and unity clients to that user disconnected
                _this.socket.broadcast.emit("disconnectFromUnity", _this.player);
            }
        });
        //for deploying
        this.socket.on('updateRotation', function (data) {
            _this.player.tankRotation = data.tankRotation;
            _this.player.barrelRotation = data.barrelRotation;
            _this.socket.to("unity").emit("updateRotation", _this.player);
        });
        this.socket.on("updatePosition", function (data) {
            _this.player.position.x = data.position.x;
            _this.player.position.y = data.position.y;
            _this.socket.to("unity").emit("updatePosition", _this.player);
        });
        this.socket.on("collisionDestroy", function (data) {
            console.log("Collission with bullet id: ", data.id);
            var returnBullets = _this.gameInstance.getBullets().filter(function (bullet) {
                return bullet.id == data.id;
            });
            returnBullets.forEach(function (bullet) {
                bullet.isDestroyed = true;
            });
        });
        this.socket.on("fireBullet", function (data) {
            var bullet = new bullet_1.default();
            bullet.name = "Bullet";
            bullet.activator = data.activator;
            bullet.position.x = data.position.x;
            bullet.position.y = data.position.y;
            bullet.direction.x = data.direction.x;
            bullet.direction.y = data.direction.y;
            _this.gameInstance.addBullet(bullet);
            console.log(bullet);
            var returnData = {
                name: bullet.name,
                id: bullet.id,
                activator: bullet.activator,
                position: {
                    x: bullet.position.x,
                    y: bullet.position.y
                },
                direction: {
                    x: bullet.direction.x,
                    y: bullet.direction.y
                }
            };
            _this.socket.emit("serverSpawn", returnData);
            _this.socket.to("unity").emit("serverSpawn", returnData);
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