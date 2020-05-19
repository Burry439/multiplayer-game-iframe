import Game  from './SocketClasses/game'
import PlayerDisconnected from './SocketInterfaces/playerDisconnect'
import socketIo, { Socket } from 'socket.io';
import Player from './SocketClasses/player';
import { Server } from 'http';
import User from './SocketInterfaces/user';
import UnitySocketListener from './unitySocketListener';

export default class SocketInstance {
    
    private io : SocketIO.Server
    public gameInstance : Game =  Game.getGameInstance();
    private static SocketInstance : SocketInstance 
    public unitySocketListener :UnitySocketListener;
    constructor(server : Server ) {

        this.io = socketIo(server)
        this.io.on("connection", (socket : Socket) =>{
            console.log("connection")
            let thisPlayerId : string = "0"
            this.unitySocketListener = new UnitySocketListener(socket, this.gameInstance)

            //when someone connects from react
            socket.on("addReactUser", (user : User) =>{
                //add user to react room
                socket.join("react")
                //has this user been added already
                
                if(!this.gameInstance.isDuplicatePlayer(user.id)){  
                    thisPlayerId = user.id
                    const newPlayer : Player = this.gameInstance.createAndAddNewPlayer(user.username,user.id)       
                    //tell only sender to first spawn
                    socket.emit("reactFirstSpawn", {allPlayers : this.gameInstance.getPlayers(), thisPlayerId : user.id})
                    //tell all other react clients to add new player
                    socket.to("react").emit("reactSpawn",  newPlayer)
                    
                } else{                  
                    //if its a duplicate add one to its instance count 
                    this.gameInstance.setPlayerAsDuplicate(user.id)
                    //tell only sender to add duplicate
                    socket.emit("duplicatePlayer",user.id)

                }
            })
            
            socket.on("disconnect", () =>{
                console.log("disconnect in react")
                //when called from unity thisPlayerId will be "0"
                if(thisPlayerId != "0"){
                    this.gameInstance.removePlayer(thisPlayerId)
                    //tell all other react and unity clients to that user disconnected
                    socket.to("react").emit("disconnectFromReact",thisPlayerId)
                }
               
            })
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
