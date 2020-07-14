import express  from "express";
import SocketInstance from "./socketIO/socketInstance"
import http, { Server } from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import path from "path"
import RoomData from "./interfaces/roomData";
import { GameConnection } from "./interfaces/gameConnection";

dotenv.config()


class ExpressServer {
  public static socketInstance : SocketInstance;
  private app: express.Application;
  private server : Server;

  constructor(){
    this.app  = express () 
    this.app.use ( bodyParser.json ( { 'limit' : '50mb' } ) )
    this.app.use ( bodyParser.urlencoded ( { 'extended' : true , 'limit' : '50mb' } ) )
    this.app.use ( cors ( { 'origin' : '*' , 'methods' : [ '*' , 'DELETE' , 'GET' , 'OPTIONS' , 'PATCH' , 'POST' ] , 'allowedHeaders' : [ '*' , 'authorization' , 'content-type' ] } ) )
    //this.app.use(this.router)
    this.app.use( '/', express.static("build/game"))

    this.app.get("*",(req,res) =>{
      const gameName = req.originalUrl.substring(0, req.originalUrl.indexOf('?')).replace(/[^a-zA-Z ]/g, "")
      const userId = Object.keys(req.query)[0]
      const roomData : RoomData = {userId : userId, gameName : gameName}
      setTimeout(() => {
        sendErrorIframe(roomData)
      }, 5000);
      res.sendFile(path.join("build/errorPage/error.html"),{ root: process.env.ROOT_FOLDER })
    })


    this.server   = http.createServer ( this.app )
    this.server.listen (  process.env.PORT || 7000 )
    ExpressServer.socketInstance = SocketInstance.getSocketInstance(this.server) 
    console.log ( '=====================================' )
    console.log ( 'SERVER SETTINGSbbbb:' )
    console.log ( `Server running at - localhost:7000`)
    console.log ( '=====================================' )
  }

  public static initSerever() : ExpressServer{
    return new ExpressServer()
}

}

const sendErrorIframe = (roomData : RoomData) => {
  const gameConnection : GameConnection = ExpressServer.socketInstance.gameInstance.getGameConnection(roomData)
  if(gameConnection){
    gameConnection.reactSocket.emit("gameReady")
  }
}

ExpressServer.initSerever()