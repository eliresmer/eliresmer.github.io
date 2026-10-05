export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(left) {
        let newX = this.x + left.x;
        let newY = this.y + left.y;
        return new Vector2(newX, newY);
    }
    subtract(left) {
        let newX = this.x - left.x;
        let newY = this.y - left.y;
        return new Vector2(newX, newY);
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    multiply(left) {
        let newX = this.x * left;
        let newY = this.y * left;
        return new Vector2(newX, newY);
    }
    divide(left) {
        let newX = this.x / left;
        let newY = this.y / left;
        return new Vector2(newX, newY);
    }
}
    