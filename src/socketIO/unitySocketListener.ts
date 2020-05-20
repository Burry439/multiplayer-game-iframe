import Player from "./SocketClasses/player"
import Bullet from "./SocketClasses/bullet"

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
         this.socket.on("addUnityUser", () =>{
             //join unity room
             this.socket.join("unity")
             this.gameInstance.getPlayers().forEach((player : Player) =>{ 
                 if(player.connectedToUnity == false){
                     this.player = player
                 }
             })
             if(this.player &&  this.player.connectedToUnity == false){
                this.gameInstance.addUnitySocket(this.socket);
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
                 this.gameInstance.getBullets().forEach((bullet : Bullet) =>{  
                   // tell sender to spawn all other unity players
                   this.socket.emit("serverSpawn",bullet)
               })
             }
             else{
                 console.log("no free usersss")
                 //tell sender he is a duplicate
                 this.socket.emit("duplicatePlayer")
             }
         })
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
        this.socket.on("disconnect", () =>{
            console.log("disconnect in unity")
            console.log(this.player)
            //when this gets called from react thisPlayerId will be "0"
            if(thisPlayerId != "0"){
                 //tell all other react and unity clients to that user disconnected
                this.socket.broadcast.emit("disconnectFromUnity",this.player)
            }        
        })
        //for deploying

        this.socket.on('updateRotation',(data : any) =>{
            this.player.tankRotation = data.tankRotation;
            this.player.barrelRotation = data.barrelRotation;
            this.socket.to("unity").emit("updateRotation",this.player)
        })

        this.socket.on("updatePosition", (data : any) =>{
            this.player.position.x = data.position.x
            this.player.position.y = data.position.y  
            this.socket.to("unity").emit("updatePosition",this.player)
        })

        this.socket.on("collisionDestroy",(data:any) =>{
            console.log("Collission with bullet id: ", data.id)
            const returnBullets = this.gameInstance.getBullets().filter((bullet : Bullet) =>{
                return bullet.id == data.id
            })

             returnBullets.forEach((bullet: Bullet) =>{
                 bullet.isDestroyed = true;
             })

        })

        this.socket.on("fireBullet", (data : any) =>{
             const bullet : Bullet = new Bullet();
             bullet.name= "Bullet"
             bullet.activator = data.activator;
             bullet.position.x = data.position.x
             bullet.position.y = data.position.y
             bullet.direction.x = data.direction.x
             bullet.direction.y = data.direction.y
             this.gameInstance.addBullet(bullet);

             console.log(bullet)

             let returnData = {
                name : bullet.name,
                id : bullet.id,
                activator: bullet.activator,
                position: {
                    x : bullet.position.x,
                    y : bullet.position.y
                },
                direction: {
                    x : bullet.direction.x,
                    y : bullet.direction.y
                }
             }
             this.socket.emit("serverSpawn", returnData)
             this.socket.to("unity").emit("serverSpawn", returnData)
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