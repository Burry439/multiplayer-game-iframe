import Game from "../SocketClasses/game";
import { Socket } from "socket.io";

export default class UnityIntervalSocketListener {
    private static  interval : any;
    private gameInstance : Game
    constructor(_gameInstance : Game){
        console.log(_gameInstance)
        this.gameInstance = _gameInstance;
        UnityIntervalSocketListener.interval = setInterval(() =>{
            this.gameInstance.getBullets().forEach((bullet) =>{
                const isDestroyed = bullet.onUpdate()
                if(isDestroyed){
                    let returnData = this.gameInstance.despawnBullet(bullet);
                    //should we remove a bullet
                    if(returnData){
                        this.gameInstance.getUnitySocket().forEach(unitySocket => {
                            unitySocket.socket.emit("serverUnspawn", returnData)
                        });
                    }
               
                } else {
                    const returnData = {
                        id : bullet.id,
                        position : bullet.position
                    }
    
                    for(let playerId in this.gameInstance.getPlayers()){

                        // since this is in an interval our data might not be in sync 
                        if(this.gameInstance.getUnitySocket()[playerId]){
                            this.gameInstance.getUnitySocket()[playerId].socket.emit("updatePosition", returnData)
                        }
                        
                    }          
                }
            });        
            for(let id in this.gameInstance.getPlayers()){
                let player = this.gameInstance.getPlayers()[id]
    
                if(player.isDead){
                    let isRespawn = player.respawnCounter();
    
                    if(isRespawn){
                        let returnData = {
                            id : player.id,
                            position : player.position
                        }
                        this.gameInstance.getUnitySocket()[id].socket.emit("playerRespawn",returnData)
                        this.gameInstance.getUnitySocket()[id].socket.to("unity").emit("playerRespawn",returnData)
                    }
                }
            }
    
        },100,0)
    }
}