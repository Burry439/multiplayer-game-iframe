import Player from "./player";
import Bullet from "./bullet";
import { Socket } from "socket.io";
import UnitySocket from "../SocketInterfaces/unitySocket";
import UnityIntervalSocketListener from "../unitySockets/unityIntervalSocketListener";
import { GameConnection } from "../../interfaces/gameConnection";
import RoomData from "../../interfaces/roomData";

export default class Game {

    private static GameInstance : Game;
   // private playerId : String;
    private players : Player[]
    private bullets : Bullet[]
    //private unitySockets : UnitySocket[];
    private gameConnections : GameConnection[]
    private unityIntervalSocketListener : UnityIntervalSocketListener;
    
    private constructor(){
        this.players = []
        this.bullets = []
        //this.unitySockets = []
        this.gameConnections = []
        this.unityIntervalSocketListener = new UnityIntervalSocketListener(this)
    }

    public getGameConnection(roomData : RoomData) : GameConnection {
        let _gameConnection : GameConnection
        this.gameConnections.forEach((gameConnection) =>{
            if(gameConnection.roomData.gameName == roomData.gameName && gameConnection.roomData.userId == roomData.userId){
                _gameConnection = gameConnection
            }
        })
        return _gameConnection
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
        this.gameConnections.forEach((gameConnection : GameConnection) =>{
            //if we find a duplicate add one to it instance count
            if(gameConnection.roomData.userId == userId){
                isDuplicate = true      
            }
        })
        return isDuplicate
    }


    public addGameConnection(gameConnection : GameConnection){
        this.gameConnections.push(gameConnection);
    }
    
    public addUnitySocketToGameConnection(roomData : RoomData, socket : SocketIO.Socket){
        const foundIndex = this.gameConnections.findIndex((gameConnection) => {
            return gameConnection.roomData.gameName == roomData.gameName && gameConnection.unitySocket == null && gameConnection.roomData.userId == roomData.userId
        });
        if(foundIndex >= 0){
           this.gameConnections[foundIndex].unitySocket = socket;
        }        
    }

    public removeGameConnection(userId : string){
        this.gameConnections.forEach((gameConnection : GameConnection, i : number) =>{
            if(gameConnection.roomData.userId == userId) {      
                //remove the disconnected player player from players array
                this.gameConnections.splice(i, 1)    
            }
        })
    }

    public getGameConnections() : GameConnection[] {
        return this.gameConnections
    }
    
    // public setPlayerAsDuplicate(playerId : string) : void{
    //     this.players.find((player : Player) =>{
    //         if(player.id == playerId){
    //             player.isDuplicate = true
    //         }
    //     })
    // }

    public createAndAddNewPlayer (username : string,userId : string) : Player {
        const newPlayer : Player = new Player(username,userId)
        this.players.push(newPlayer)
        return newPlayer
    }
}

      

