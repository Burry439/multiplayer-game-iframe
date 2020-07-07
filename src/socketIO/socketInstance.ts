import Game  from './SocketClasses/game'
import socketIo, { Socket } from 'socket.io';
import { Server } from 'http';
import UnitySocketListener from './unitySockets/unitySocketListener';
import ReactSocketListener from './reactSockets/reactSocketListener';

export default class SocketInstance {
    
    private io : SocketIO.Server
    public gameInstance : Game =  Game.getGameInstance();
    private static SocketInstance : SocketInstance 
    public unitySocketListener :UnitySocketListener;
    public reactSocketListner :ReactSocketListener;
    constructor(server : Server ) {

        this.io = socketIo(server)
        this.io.on("connection", (socket : Socket) =>{
            console.log("connection")
            this.reactSocketListner = new ReactSocketListener(socket,this.gameInstance);
            this.unitySocketListener = new UnitySocketListener(socket, this.gameInstance)  
        })
    } 
    
    public static getSocketInstance(server : Server) : SocketInstance { 
            if(!SocketInstance.SocketInstance){
                console.log("creating new socket instance")
                SocketInstance.SocketInstance = new SocketInstance(server)
            }
            return SocketInstance.SocketInstance   
    }
}
