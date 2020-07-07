import Player from "../SocketClasses/player"
import Game from "../SocketClasses/game"
import Bullet from "../SocketClasses/bullet"
import { Socket } from "socket.io"
export default class UnityGameplaySocketListener {
    socket : Socket
    player : Player
    thisPlayerId : String
    gameInstance : Game
    constructor(_socket : any, _player : Player, _thisPlayerId : String, _gameInstance : Game){
        this.player = _player
        this.socket = _socket
        this.thisPlayerId = _thisPlayerId
        this.gameInstance = _gameInstance

        this.socket.on('updateRotation',(data : any) =>{
            this.player.tankRotation = data.tankRotation;
            this.player.barrelRotation = data.barrelRotation;
            this.socket.to("unity").emit("updateRotation",this.player)
        })

        this.socket.on("updatePosition", (data : any) =>{
            this.player.position = data.position
            this.socket.to("unity").emit("updatePosition",this.player)
        })

        this.socket.on("collisionDestroy",(data:any) =>{
            const returnBullets = this.gameInstance.getBullets().filter((bullet : Bullet) =>{
                return bullet.id == data.id
            })
            //we will mosst likely only have one entry but just in case loop through all and set destroyed???
             returnBullets.forEach((bullet: Bullet) =>{
                let playerHit = false   
                for(let id in this.gameInstance.getPlayers()){
                    //if we are not not the one who shot
                    if(bullet.activator != id){
                        let player : Player = this.gameInstance.getPlayers()[id]
                        let distance = bullet.position.distance(player.position)
                        if(distance < 0.65){
                            playerHit = true;
                            let isDead = player.dealDamage(50);
                            if(isDead){
                                let returnData = {
                                    id: player.id,
                                }
                                this.socket.emit("playerDied", returnData)
                                this.socket.to("unity").emit("playerDied", returnData)
                            }else{
                                console.log("player with id: ", player.id, " has: ", player.health, " health left")
                            }
                            let returnData = this.gameInstance.despawnBullet(bullet)
                            if(returnData){
                                this.gameInstance.getUnitySocket().forEach(unitySocket => {
                                    unitySocket.socket.emit("serverUnspawn", returnData)
                                });
                            }
                        }
                    }
                }
                if(!playerHit){
                    bullet.isDestroyed = true;
                }        
             })
        })
        this.socket.on("fireBullet", (data : any) =>{
             const bullet : Bullet = new Bullet("Bullet", data.activator,data.position,data.direction);
             this.gameInstance.addBullet(bullet);
             this.socket.emit("serverSpawn", bullet)
             this.socket.to("unity").emit("serverSpawn", bullet)
        })
    }
}
