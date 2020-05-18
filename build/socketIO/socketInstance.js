"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __importDefault(require("./SocketClasses/game"));
var socket_io_1 = __importDefault(require("socket.io"));
var unitySocketListener_1 = __importDefault(require("./unitySocketListener"));
var SocketInstance = /** @class */ (function () {
    function SocketInstance(server) {
        var _this = this;
        this.gameInstance = game_1.default.getGameInstance();
        this.io = socket_io_1.default(server);
        this.io.on("connection", function (socket) {
            console.log("connection");
            var thisPlayerId = "0";
            _this.unitySocketListener = new unitySocketListener_1.default(socket, _this.gameInstance);
            //when someone connects from react
            socket.on("addReactUser", function (user) {
                //add user to react room
                socket.join("react");
                //has this user been added already
                if (!_this.gameInstance.isDuplicatePlayer(user.id)) {
                    thisPlayerId = user.id;
                    var newPlayer = _this.gameInstance.createAndAddNewPlayer(user.username, user.id);
                    //tell only sender to first spawn
                    socket.emit("reactFirstSpawn", { allPlayers: _this.gameInstance.getPlayers(), thisPlayerId: user.id });
                    //tell all other react clients to add new player
                    socket.to("react").emit("reactSpawn", newPlayer);
                }
                else {
                    //if its a duplicate add one to its instance count 
                    _this.gameInstance.setPlayerAsDuplicate(user.id);
                    //tell only sender to add duplicate
                    socket.emit("duplicatePlayer", user.id);
                }
            });
            socket.on("disconnect", function () {
                console.log("disconnect in react");
                //when called from unity thisPlayerId will be "0"
                if (thisPlayerId != "0") {
                    _this.gameInstance.removePlayer(thisPlayerId);
                    //tell all other react and unity clients to that user disconnected
                    socket.to("react").emit("disconnectFromReact", thisPlayerId);
                }
            });
        });
    }
    SocketInstance.getSocketInstance = function (server) {
        if (!SocketInstance.SocketInstance) {
            console.log("creating new socket instance");
            SocketInstance.SocketInstance = new SocketInstance(server);
        }
        return SocketInstance.SocketInstance;
    };
    return SocketInstance;
}());
exports.default = SocketInstance;
//# sourceMappingURL=socketInstance.js.map