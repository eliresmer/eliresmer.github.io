export class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(left) {
        let newX = this.x + left.x;
        let newY = this.y + left.y;
        let newZ = this.z + left.z;
        return new Vector3(newX, newY, newZ);
    }
    subtract(left) {
        let newX = this.x - left.x;
        let newY = this.y - left.y;
        let newZ = this.z - left.z;
        return new Vector3(newX, newY, newZ);
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    multiply(left) {
        let newX = this.x * left;
        let newY = this.y * left;
        let newZ = this.z * left;
        return new Vector3(newX, newY, newZ);
    }
    divide(left) {
        let newX = this.x / left;
        let newY = this.y / left;
        let newZ = this.z / left;
        return new Vector3(newX, newY, newZ);
    }
}
    