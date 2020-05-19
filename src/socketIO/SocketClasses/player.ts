import Vector2 from "./vector2"

export default  class Player {
    id : String
    username : String
    position : Vector2
    connectedToUnity : Boolean
    isDuplicate : Boolean
    constructor(_username : String, _id : String){
        this.id = _id
        this.username = _username
        this.position = new Vector2()
        this.connectedToUnity = false,
        this.isDuplicate = false
    }

}

