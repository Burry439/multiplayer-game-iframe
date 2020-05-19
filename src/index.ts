import express  from "express";
import path from "path"
import SocketInstance from "./socketIO/socketInstance"
import http, { Server } from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()


class ExpressServer {
  public socketInstance : SocketInstance;
  private app: express.Application;
  private server : Server;

  constructor(){
    this.app  = express () 
    this.app.use ( bodyParser.json ( { 'limit' : '50mb' } ) )
    this.app.use ( bodyParser.urlencoded ( { 'extended' : true , 'limit' : '50mb' } ) )
    this.app.use ( cors ( { 'origin' : '*' , 'methods' : [ '*' , 'DELETE' , 'GET' , 'OPTIONS' , 'PATCH' , 'POST' ] , 'allowedHeaders' : [ '*' , 'authorization' , 'content-type' ] } ) )
    //this.app.use(this.router)
    this.app.use( '/', express.static(__dirname + "/game"))
    console.log(__dirname)
    this.server   = http.createServer ( this.app )
    this.server.listen (  process.env.PORT || 7000 )
    this.socketInstance = SocketInstance.getSocketInstance(this.server) 
    console.log ( '=====================================' )
    console.log ( 'SERVER SETTINGSbbbb:' )
    console.log ( `Server running at - localhost:7000`)
    console.log ( '=====================================' )
  }

  public static initSerever() : ExpressServer{
    return new ExpressServer()
}

}

ExpressServer.initSerever()