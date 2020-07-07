import Player from "./player";
import Bullet from "./bullet";
import { Socket } from "socket.io";
import UnitySocket from "../SocketInterfaces/unitySocket";
import UnityIntervalSocketListener from "../unitySockets/unityIntervalSocketListener";

export default class Game {

    private static GameInstance : Game;
   // private playerId : String;
    private players : Player[]
    private bullets : Bullet[]
    private unitySockets : UnitySocket[];
    private unityIntervalSocketListener : UnityIntervalSocketListener;
    private constructor(){
        this.players = []
        this.bullets = []
        this.unitySockets = []
        this.unityIntervalSocketListener = new UnityIntervalSocketListener(this)
    }

    public despawnBullet(bullet : Bullet) {
        console.log("destroy bullet: ", bullet.id)
        const index = this.bullets.indexOf(bullet)
        if(index > -1){
            this.bullets.splice(index,1)
            const returnData = {
                id : bullet.id,
            }   
            return returnData
        }
    }

    public removePlayer(playerId : string){
        this.players.forEach((player : Player, i : number) =>{
            if(player.id == playerId) {      
                //remove the disconnected player player from players array
                this.players.splice(i, 1)              
            }
        })
    }

    public getPlayers() : Player[] {
        return this.players
    }
    public getBullets() : Bullet[] {
        return this.bullets
    }

    public addUnitySocket(socket : UnitySocket){
        this.unitySockets.push(socket);
    }

    
    public removeUnitySocket(playerId : string){
        this.unitySockets.forEach((unitySocket : UnitySocket, i : number) =>{
            if(unitySocket.playerId == playerId) {      
                //remove the disconnected player player from players array
                this.unitySockets.splice(i, 1)              
            }
        })
    }

    public getUnitySocket() : UnitySocket[]{
        return this.unitySockets
    }

    public addBullet(bullet : Bullet){
        this.bullets.push(bullet);
    }

    public getPlayerById(playerId : string) : Player {
       return this.players.find((player : Player) =>{
          return player.id == playerId
       })
    }

    public static getGameInstance(): Game  {
        if(!Game.GameInstance){
            Game.GameInstance = new Game()
        }

        return Game.GameInstance
    }

    public isDuplicatePlayer(userId : string) : boolean{
        let isDuplicate : boolean = false
        this.players.forEach((player : Player) =>{
            //if we find a duplicate add one to it instance count
            if(player.id == userId){
                isDuplicate = true      
            }
        })
        return isDuplicate
    }

    public setPlayerAsDuplicate(playerId : string) : void{
        this.players.find((player : Player) =>{
            if(player.id == playerId){
                player.isDuplicate = true
            }
        })
    }

    public createAndAddNewPlayer (username : string,userId : string) : Player {
        const newPlayer : Player = new Player(username,userId)
        this.players.push(newPlayer)
        return newPlayer
    }
}

      

