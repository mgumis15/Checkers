class PlaneOne {
    constructor() {
        this.geometry = new THREE.BoxGeometry(30, 30, 30, 30);
    }
    white() {
        let white = new THREE.Mesh(planeOne.geometry, Settings.whiteMeshMaterial);
        return white
    }
    black() {

        let black = new THREE.Mesh(planeOne.geometry, Settings.blackMeshMaterial);
        return black
    }
}