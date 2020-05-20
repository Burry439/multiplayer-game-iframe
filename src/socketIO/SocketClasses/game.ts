import Player from "./player";
import PlayerDisconnected from "../SocketInterfaces/playerDisconnect";
import Bullet from "./bullet";
import { Socket } from "socket.io";

export default class Game {

    private static GameInstance : Game;
   // private playerId : String;
    private players : Player[]
    private bullets : Bullet[]
    private unitySockets : Socket[];

    private constructor(){
        this.players = []
        this.bullets = []
        this.unitySockets = []
        setInterval(() =>{
            this.bullets.forEach((bullet) =>{
                const isDestroyed = bullet.onUpdate()

                if(isDestroyed){
                    const index = this.bullets.indexOf(bullet)
                    if(index > -1){
                        this.bullets.splice(index,1)

                        const returnData = {
                            id : bullet.id,
                        }
                        
                        this.unitySockets.forEach(socket => {
                            socket.emit("serverUnspawn", returnData)
                        });
                       
                    }
                } else {
                    const returnData = {
                        id : bullet.id,
                        position : {
                            x : bullet.position.x,
                            y : bullet.position.y,
                        }
                    }

                    this.unitySockets.forEach(socket => {
                        socket.emit("updatePosition", returnData)
                    });
                    
                }
            });
            

        },100,0)
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

    public addUnitySocket(socket : Socket){
        this.unitySockets.push(socket);
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

      

