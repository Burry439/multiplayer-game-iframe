import Player from "./player";
import PlayerDisconnected from "../SocketInterfaces/playerDisconnect";

export default class Game {

    private static GameInstance : Game;
   // private playerId : String;
    private players : Player[]

    private constructor(){
        this.players = []
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

      

