class Pawn extends THREE.Mesh {
    constructor(geometry, material, x, z) {
        super(geometry, material)
        // this._x = x
        this.position.x = x
        this.position.z = z
        this.nazwa
        // this._z = z
        return this
    }
    set positionX(x) {
        this.position.x = x
    }
    get positionX() {
        return this.position.x
    }
    set positionZ(z) {
        this.position.z = z
    }
    get positionZ() {
        return this.position.x
    }


}
