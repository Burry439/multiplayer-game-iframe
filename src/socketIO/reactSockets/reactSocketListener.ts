import Player from "../SocketClasses/player"
import Game from "../SocketClasses/game"
import User from "../SocketInterfaces/user"
import { Socket } from "socket.io"

    export default class ReactSocketListener {
        socket : Socket
        gameInstance : Game
        player : Player
        constructor(_socket : Socket,_gameInstance : Game){
            this.socket = _socket
            this.gameInstance = _gameInstance
            let thisPlayerId : string = "0"

            this.socket.on("addReactUser", (user : User) =>{
                //add user to react room
                this.socket.join("react")
                //has this user been added already
                
                if(!this.gameInstance.isDuplicatePlayer(user.id)){  
                    thisPlayerId = user.id
                    const newPlayer : Player = this.gameInstance.createAndAddNewPlayer(user.username,user.id)       
                    //tell only sender to first spawn
                    this.socket.emit("reactFirstSpawn", {allPlayers : this.gameInstance.getPlayers(), thisPlayerId : user.id})
                    //tell all other react clients to add new player
                    this.socket.to("react").emit("reactSpawn",  newPlayer)
                    
                } else{                  
                    //if its a duplicate add one to its instance count 
                    this.gameInstance.setPlayerAsDuplicate(user.id)
                    //tell only sender to add duplicate
                    this.socket.emit("duplicatePlayer",user.id)
                }
            })

            this.socket.on("disconnect", () =>{
                console.log("disconnect in react")
                //when called from unity thisPlayerId will be "0"
                if(thisPlayerId != "0"){
                    this.gameInstance.removePlayer(thisPlayerId)
                    //tell all other react and unity clients to that user disconnected
                    this.socket.to("react").emit("disconnectFromReact",thisPlayerId)
                }
               
            })
    }
}