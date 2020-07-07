import Player from "../SocketClasses/player"
import Game from "../SocketClasses/game"
import User from "../SocketInterfaces/user"
import { Socket } from "socket.io"
import RoomData from "../../interfaces/roomData"
import { GameConnection } from "../../interfaces/gameConnection"

    export default class ReactSocketListener {
        socket : Socket
        gameInstance : Game
        player : Player
        roomData : RoomData
        userId : string = "0"


        constructor(_socket : Socket,_gameInstance : Game, _roomData : RoomData){
            this.socket = _socket
            this.gameInstance = _gameInstance
            this.roomData = _roomData 
                if(!this.gameInstance.isDuplicatePlayer(this.roomData.userId)){  
                    console.log(this.roomData.gameName + "/" + this.roomData.userId)
                    this.socket.join(this.roomData.gameName + "/" + this.roomData.userId)

                    this.gameInstance.addGameConnection({
                        roomData : {
                            userId : this.roomData.userId ,
                            gameName : this.roomData.gameName,
                        },
                        reactSocket : this.socket,
                        unitySocket : null
                    })
                    this.userId = this.roomData.userId;

                    // const newPlayer : Player = this.gameInstance.createAndAddNewPlayer(user.username,user.id)       
                    // //tell only sender to first spawn
                    // this.socket.emit("reactFirstSpawn", {allPlayers : this.gameInstance.getPlayers(), thisPlayerId : user.id})
                    // //tell all other react clients to add new player
                    // this.socket.to("react").emit("reactSpawn",  newPlayer)
                    
                } else{                  
                    this.socket.emit('isDuplicate')
                }
           // })

            this.socket.on("disconnect", () =>{
                console.log("disconnect in react")
                this.gameInstance.removeGameConnection(this.userId)
                // if(thisPlayerId != "0"){
                //     this.gameInstance.removePlayer(thisPlayerId)
                //     //tell all other react and unity clients to that user disconnected
                //     this.socket.to("react").emit("disconnectFromReact",thisPlayerId)
                // }
            })
    }
}