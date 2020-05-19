import Player from "./SocketClasses/player"
import Game from "./SocketClasses/game"
import PlayerPostion from "./SocketInterfaces/playerPositon"

export default class UnitySocketListener {
    socket : any
    gameInstance : any
    player : Player
    constructor(_socket : any, _gameInstance : Game){
        this.socket = _socket
        this.gameInstance = _gameInstance
        let thisPlayerId : String = "0"

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

         this.socket.on("addUnityUser", () =>{
             //join unity room
             this.socket.join("unity")
             this.gameInstance.getPlayers().forEach((player : Player) =>{ 
                 if(player.connectedToUnity == false){
                     this.player = player
                 }
             })
             if(this.player &&  this.player.connectedToUnity == false){
                thisPlayerId = this.player.id
                 this.player.connectedToUnity = true
                 //tell sender to regeister
                 this.socket.emit("register", this.player)
                //tell others in unity room to spawn new player
                this.socket.to("unity").emit("spawn", this.player)
                 this.gameInstance.getPlayers().forEach((player : Player) =>{  
                     // tell sender to spawn all other unity players
                     this.socket.emit("spawn",player)
                 })
             }
             else{
                 console.log("no free usersss")
                 //tell sender he is a duplicate
                 this.socket.emit("duplicatePlayer")
             }
         })

        this.socket.on("disconnect", () =>{
            console.log("disconnect in unity")
            console.log(this.player)
            //when this gets called from react thisPlayerId will be "0"
            if(thisPlayerId != "0"){
                 //tell all other react and unity clients to that user disconnected
                this.socket.broadcast.emit("disconnectFromUnity",this.player)
            }        
        })

        this.socket.on("updatePosition", (data : any) =>{
            this.player.position.x = data.position.x
            this.player.position.y = data.position.y  
            this.socket.to("unity").emit("updatePosition",this.player)
        })

    }
}