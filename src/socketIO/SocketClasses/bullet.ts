import Vector2 from "./vector2"
import ServerObjects from "./serverObject";

export default class Bullet extends ServerObjects{
    
    direction : Vector2;
    speed : number
    isDestroyed : boolean
    activator : string
    constructor(){
        super();
        this.direction = new Vector2();
        this.speed = 0.5;
        this.isDestroyed = false
        this.activator = ''
    }

    onUpdate(){
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;

        return this.isDestroyed
    }
}
