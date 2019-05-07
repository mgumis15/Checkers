var Settings = {
    whiteMaterial: new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: false,
        opacity: 1,
        map: new THREE.TextureLoader().load("whiteWoodCylinder.jpg"),
    }),
    blackMaterial: new THREE.MeshBasicMaterial({
        color: 0x999999,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: false,
        opacity: 1,
        map: new THREE.TextureLoader().load("blackWoodCylinder.jpg"),
    }),
    whiteMeshMaterial: new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: false,
        opacity: 1,
        map: new THREE.TextureLoader().load("whiteWood.jpg"),
    }),
    blackMeshMaterial: new THREE.MeshBasicMaterial({
        color: 0x999999,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: false,
        opacity: 1,
        map: new THREE.TextureLoader().load("blackWood.jpg"),
    }),
    geometry: new THREE.CylinderGeometry(15, 15, 13, 30)
}