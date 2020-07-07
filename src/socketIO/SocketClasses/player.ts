import Vector2 from "./vector2"

export default  class Player {
    id : String
    username : String
    position : Vector2
    tankRotation : number
    barrelRotation : number
    health : number
    isDead : boolean
    respawnTicker : number
    respawnTime : number
    connectedToUnity : Boolean
    isDuplicate : Boolean
    constructor(_username : String, _id : String){
        this.id = _id
        this.username = _username
        this.position = new Vector2(),
        this.tankRotation = 0
        this.barrelRotation = 0
        this.health = 100;
        this.isDead = false
        this.respawnTicker = 0
        this.respawnTime = 0
        this.connectedToUnity = false
        this.isDuplicate = false
    }

    respawnCounter(){
        this.respawnTicker += 1;

        if(this.respawnTicker >= 10){
            this.respawnTicker = 0;
            this.respawnTime += 1

            if(this.respawnTime >= 3){
                console.log("Respawn Player id:" , this.id)
                this.isDead = false
                this.respawnTicker = 0;
                this.respawnTime = 0;
                this.health = 100;
                this.position = new Vector2(0,0)

                return true
            }
        }

        return false
    }

    dealDamage(amount : number){
        this.health -= amount;
        if(this.health <= 0){
            this.isDead = true;
            this.respawnTicker = 0;
            this.respawnTime = 0;
        }
        return this.isDead;
    }
}

