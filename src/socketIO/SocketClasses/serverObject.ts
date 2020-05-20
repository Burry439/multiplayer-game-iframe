import Vector2 from "./vector2"
//import ShortUniqueId from 'short-unique-id';

export default  class ServerObjects {
    
    id : String
    name : String
    position : Vector2
    constructor(){
        this.id = Math.floor((Math.random() * 100000) + 1).toString();
        this.name = "ServerObject";
        this.position = new Vector2()
        console.log(this.id )
    }
}
