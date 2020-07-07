import Vector2 from "./vector2"
import ServerObjects from "./serverObject";

export default class Bullet extends ServerObjects{
    
    direction : Vector2;
    speed : number
    isDestroyed : boolean
    activator : string
    constructor(_name : string,_activator : string, _position : Vector2, _direction : Vector2){
        console.log(_direction)
        super();
        this.name = _name
        this.activator = _activator;
        this.position = new Vector2(_position.x,_position.y)
        this.direction= new Vector2(_direction.x,_direction.y)
        this.speed = 0.5;
        this.isDestroyed = false
        
    }

    onUpdate(){
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;
        return this.isDestroyed
    }
}
