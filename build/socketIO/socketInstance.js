"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __importDefault(require("./SocketClasses/game"));
var socket_io_1 = __importDefault(require("socket.io"));
var unitySocketListener_1 = __importDefault(require("./unitySockets/unitySocketListener"));
var reactSocketListener_1 = __importDefault(require("./reactSockets/reactSocketListener"));
var SocketInstance = /** @class */ (function () {
    function SocketInstance(server) {
        var _this = this;
        this.gameInstance = game_1.default.getGameInstance();
        this.io = socket_io_1.default(server);
        this.io.on("connection", function (socket) {
            console.log("connection");
            _this.reactSocketListner = new reactSocketListener_1.default(socket, _this.gameInstance);
            _this.unitySocketListener = new unitySocketListener_1.default(socket, _this.gameInstance);
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