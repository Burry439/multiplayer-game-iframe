class Vector2 {
    x : number = 0
    y : number = 0
    constructor(x : number = 0, y : number = 0){
        this.x = x,
        this.y = y
    }

    magnitude(){
        return Math.sqrt((this.x * this.x) + (this.y * this.y))
    }

    normalized(){
        const mag = this.magnitude()
        return new Vector2(this.x / mag, this.y / mag)
    }

    distance(otherVect : Vector2){
        const direction = new Vector2()
        direction.x = otherVect.x - this.x;
        direction.y = otherVect.y- this.y;
        return direction.magnitude()
    }

    consoleOutput(){
        return '( ' + this.x + ' , ' + this.y + ' ) ';
    }
}

export default Vector2