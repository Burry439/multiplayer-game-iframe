import Game  from './SocketClasses/game'
import socketIo, { Socket } from 'socket.io';
import { Server } from 'http';
import UnitySocketListener from './unitySockets/unitySocketListener';
import ReactSocketListener from './reactSockets/reactSocketListener';
import RoomData  from '../interfaces/roomData';

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

            socket.on("ReactConnected",(roomData : RoomData) =>{
                console.log("react connected")
                new ReactSocketListener(socket,this.gameInstance, roomData)
            })

            socket.on("UnityConnection",async (roomData : RoomData) =>{
                console.log("unity connected")
                //const gameData : GameData = await this.getGameData(roomData.gameName)
                new UnitySocketListener(socket, this.gameInstance,roomData)
            })
            
           // this.unitySocketListener = new UnitySocketListener(socket, this.gameInstance)  
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
