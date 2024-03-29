import Player from "../SocketClasses/player"
import Bullet from "../SocketClasses/bullet"
import Game from "../SocketClasses/game"
import UnityGameplaySocketListener from "./unityGameplaySocketListener"
import UnityIntervalSocketListener from "./unityIntervalSocketListener"
import RoomData from "../../interfaces/roomData"

export default class UnitySocketListener {
    socket : any
    gameInstance : Game
    player : Player
    roomData : RoomData
    userId : string
    constructor(_socket : any, _gameInstance : Game, _roomData : RoomData){
        this.socket = _socket
        this.gameInstance = _gameInstance
        this.roomData = _roomData
        this.userId  = "0"


        //////////////////For Using with React///////////////////////////////
         //this.socket.on("addUnityUser", () =>{
            if(!this.roomData.userId){
                console.log("in if")
                this.socket.emit("sendToErrorPage",{})
            }else{
                console.log("in else")
                this.gameInstance.addUnitySocketToGameConnection(_roomData, this.socket)
                this.socket.join("unity")
                this.socket.join(this.roomData.gameName + "/" + this.roomData.userId)
                this.socket.to(this.roomData.gameName + "/" + this.roomData.userId).emit("gameReady")
                this.userId = this.roomData.userId
                this.player = this.gameInstance.createAndAddNewPlayer("testPlayer",this.userId)
                
                new UnityGameplaySocketListener(this.socket,this.player,this.userId,this.gameInstance)
               // new UnityIntervalSocketListener(this.gameInstance)
                this.socket.emit("register", this.player)
                //tell others in unity room to spawn new player
                this.socket.to("unity").emit("spawn", this.player)
                
                this.gameInstance.getPlayers().forEach((player : Player) =>{  
                     // tell sender to spawn all other unity players
                     this.socket.emit("spawn",player)
                 })
                 this.gameInstance.getBullets().forEach((bullet : Bullet) =>{  
                   // tell sender to spawn all other unity players
                   this.socket.emit("serverSpawn",bullet)
               })
            //Join Room And Tell react we conencted
 
             //join unity room
             //this.socket.join("unity")
            //  this.gameInstance.getPlayers().forEach((player : Player) =>{ 
            //      if(player.connectedToUnity == false){
            //          this.player = player
            //      }
            //  })
            //  if(this.player &&  this.player.connectedToUnity == false){
            //      console.log("on that if")
                
            //     thisPlayerId = this.player.id
            //     this.gameInstance.addUnitySocket({playerId : thisPlayerId, socket : this.socket});
            //      this.player.connectedToUnity = true
            //         //set unity gameplay listener
            //        new UnityGameplaySocketListener(this.socket,this.player,thisPlayerId,this.gameInstance)
                   
            //      //tell sender to regeister
            //      this.socket.emit("register", this.player)
            //     //tell others in unity room to spawn new player
            //     this.socket.to("unity").emit("spawn", this.player)
            //      this.gameInstance.getPlayers().forEach((player : Player) =>{  
            //          // tell sender to spawn all other unity players
            //          this.socket.emit("spawn",player)
            //      })
            //      this.gameInstance.getBullets().forEach((bullet : Bullet) =>{  
            //        // tell sender to spawn all other unity players
            //        this.socket.emit("serverSpawn",bullet)
            //    })
            //  }
            //  else{
            //      console.log("no free usersss")
            //      //tell sender he is a duplicate
            //      this.socket.emit("duplicatePlayer")
            //  }
      //   })
        //////////////////For Deploying///////////////////////////////

        this.socket.on("disconnect", () =>{
            console.log("disconnect in unity")
             //when this gets called from react thisPlayerId will be "0"
                if(this.userId != "0"){
                    this.gameInstance.removePlayer(this.userId)
                    //this.gameInstance.removeUnitySocket(this.userId)
                    //tell all other react and unity clients to that user disconnected
                    this.socket.to("unity").emit("disconnectFromUnity",this.player)
                    // this.gameInstance.removeGameConnection(this.userId)
                }        
            })
           
        const interval = (func : Function, wait : any, times: any) =>{
            let interv = (w : any,t: any) =>{
                return () =>{
                    if(typeof t === "undefined" || t -- > 0){
                        setTimeout(interv,w);
                        try{
                            func.call(null);
                        }catch(e){
                            t = 0;
                            throw e.toString()
                        }
                    }
                };
            }
            interv(wait, times);
            setTimeout(interv,wait)
        }
    }

}
}















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
