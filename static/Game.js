class Game {
    constructor() {
        this.planeTab = [

            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]

        ];

        this.pionkiTab = [

            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];
        this.scene
        this.clicked = null
        this.flag
    }
    init() {
        game.scene = new THREE.Scene()
        game.camera = new THREE.PerspectiveCamera(
            45,    // kąt patrzenia kamery (FOV - field of view)
            $(window).width() / $(window).height(),    // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maxymalna renderowana odległość od kamery 
        );

        var renderer = new THREE.WebGLRenderer();
        var orbitControl = new THREE.OrbitControls(game.camera, renderer.domElement);
        orbitControl.addEventListener('change', function () {
            renderer.render(game.scene, game.camera)
        });
        var axes = new THREE.AxesHelper(1000)
        game.scene.add(axes);

        renderer.setClearColor(0xC0C0C0);
        renderer.setSize($(window).width(), $(window).height());
        $("#root").append(renderer.domElement);


        game.camera.position.set(200, 250, 0)
        game.camera.lookAt(game.scene.position)

        game.scene.add(game.createPlane())


        function render() {
            $(window).on("resize", function () {
                renderer.setSize($(window).width(), $(window).height());
                game.camera.aspect = window.innerWidth / window.innerHeight;
                game.camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);


            })
            renderer.render(game.scene, game.camera);
            requestAnimationFrame(render);

        }
        render();
    }
    createPlane() {
        // let black = new THREE.Mesh(geometry, material);
        let container = new THREE.Object3D();
        var one
        for (let i = 0; i < game.planeTab.length; i++) {
            for (let n = 0; n < game.planeTab[i].length; n++) {
                if (game.planeTab[i][n] == 0) {
                    one = planeOne.white()
                    one.nazwa = "whiteMesh"
                    one.name = i + "x" + n

                } else {
                    one = planeOne.black()
                    one.nazwa = "blackMesh"
                    one.name = i + "x" + n
                }
                one.position.x = 30 * (i - 4) + 15
                one.position.z = 30 * (n - 4) + 15
                container.add(one);
            }
        }
        // // dodanie światła do kontenera
        return container
    }
    createClones(flag) {
        let container = new THREE.Object3D();
        var one
        for (let i = 0; i < game.pionkiTab.length; i++) {
            for (let n = 0; n < game.pionkiTab[i].length; n++) {
                if (game.pionkiTab[i][n] == 1) {
                    one = new Pawn(Settings.geometry, Settings.whiteMaterial, (30 * (i - 4) + 15), (30 * (n - 4) + 15))
                    one.nazwa = "whiteCylinder"
                    one.class = "man"
                    one.name = i + "x" + n
                } else if (game.pionkiTab[i][n] == 2) {
                    one = new Pawn(Settings.geometry, Settings.blackMaterial, (30 * (i - 4) + 15), (30 * (n - 4) + 15))
                    one.nazwa = "blackCylinder"
                    one.class = "man"
                    one.name = i + "x" + n
                } else {
                    continue;
                }
                one.position.y = 22
                container.add(one);
            }
        }
        game.flag = flag
        if (flag == 0) {
            game.camera.position.set(-200, 250, 0)
            game.camera.lookAt(game.scene.position)
        }
        return game.scene.add(container)
    }
    raycaster() {
        var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
        var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D
        $(document).mousedown(function (event) {
            //tura
            if (net.tura == game.flag) {
                mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
                mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
                raycaster.setFromCamera(mouseVector, game.camera);
                //wybór pionka
                if (game.clicked == null) {
                    var intersects = raycaster.intersectObjects(game.scene.children[2].children);
                    if (game.flag == 0) {
                        if (intersects.length > 0) {
                            if (intersects[0].object.nazwa == "blackCylinder") {
                                intersects[0].object.material = intersects[0].object.material.clone()
                                intersects[0].object.material.color.setHex(0xFF0000)
                                let index = intersects[0].object.name.split("x")
                                game.clicked = intersects[0].object
                            }
                        }
                    } else if (game.flag == 1) {
                        if (intersects.length > 0) {
                            if (intersects[0].object.nazwa == "whiteCylinder") {
                                intersects[0].object.material = intersects[0].object.material.clone()
                                intersects[0].object.material.color.setHex(0xFF0000)
                                game.clicked = intersects[0].object
                            }
                        }
                    }
                } else {
                    var intersects = raycaster.intersectObjects(game.scene.children[1].children);
                    var intersectsB = raycaster.intersectObjects(game.scene.children[2].children);
                    //podmiana pionka
                    if (intersectsB.length > 0) {
                        let indexB = intersectsB[0].object.name.split("x")
                        let indexP = game.clicked.name.split("x")
                        let enemy
                        if (intersectsB[0].object.nazwa == game.clicked.nazwa) {
                            if (game.flag == 0) {
                                game.clicked.material = Settings.blackMaterial
                            } else if (game.flag == 1) {
                                game.clicked.material = Settings.whiteMaterial
                            }
                            intersectsB[0].object.material = intersectsB[0].object.material.clone()
                            intersectsB[0].object.material.color.setHex(0xFF0000)
                            game.clicked = intersectsB[0].object
                            // } else if (game.clicked.class == "man") {
                        } else if (((indexB[0] == parseInt(indexP[0]) - 1) && (indexB[1] == parseInt(indexP[1]) - 1)) || ((indexB[0] == parseInt(indexP[0]) - 1) && (indexB[1] == parseInt(indexP[1]) + 1)) || ((indexB[0] == parseInt(indexP[0]) + 1) && (indexB[1] == parseInt(indexP[1]) - 1)) || ((indexB[0] == parseInt(indexP[0]) + 1) && (indexB[1] == parseInt(indexP[1]) + 1))) {
                            enemy = intersectsB[0].object
                            let enemyVectorX = parseInt(indexB[0]) - parseInt(indexP[0])
                            let enemyVectorY = parseInt(indexB[1]) - parseInt(indexP[1])
                            let checkVector = (parseInt(indexP[0]) + (2 * enemyVectorX)) + "x" + (parseInt(indexP[1]) + (2 * enemyVectorY))
                            let bezpiecznik = true
                            for (let i = 0; i < game.scene.children[2].children.length; i++) if (game.scene.children[2].children[i].name == checkVector) bezpiecznik = false
                            if (bezpiecznik) {
                                net.kill(checkVector, game.clicked.name, intersects[0].object.name)
                                game.clicked.name = checkVector
                                var index = game.scene.children[2].children.indexOf(intersectsB[0].object);
                                if (index > -1) {
                                    game.scene.children[2].children.splice(index, 1);
                                }
                                for (let i = 0; i < game.scene.children[1].children.length; i++) {
                                    if (game.scene.children[1].children[i].name == checkVector) {
                                        game.clicked.position.x = game.scene.children[1].children[i].position.x
                                        game.clicked.position.z = game.scene.children[1].children[i].position.z
                                    }
                                }
                                if (game.flag == 0) {
                                    game.clicked.material = Settings.blackMaterial
                                    if (checkVector[0] == "7") {
                                        game.clicked.class = "king"
                                        game.clicked.rotation.x = 45
                                    }
                                } else if (game.flag == 1) {
                                    game.clicked.material = Settings.whiteMaterial
                                    if (checkVector[0] == "0") {
                                        game.clicked.class = "king"
                                        game.clicked.rotation.x = 45
                                    }
                                }
                                net.tura++
                                net.tura = net.tura % 2
                                game.clicked = null
                                let wygrana = true
                                game.scene.children[2].children.forEach(element => {
                                    if (game.flag == 0) {
                                        if (element.nazwa == "whiteCylinder") wygrana = false
                                    } else {
                                        if (element.nazwa == "blackCylinder") wygrana = false
                                    }
                                });
                                if (wygrana) {
                                    console.log("WYGRAŁEŚ")
                                }
                                net.realGame()
                            }
                        }

                        //  } else if (game.clicked.class == "king") {
                        let kingsMove = false
                        for (let i = 1; i < 8; i++) {
                            if ((indexB[0] == parseInt(indexP[0]) - i) && (indexB[1] == parseInt(indexP[1]) - i)) kingsMove = true
                            if ((indexB[0] == parseInt(indexP[0]) - i) && (indexB[1] == parseInt(indexP[1]) + i)) kingsMove = true
                            if ((indexB[0] == parseInt(indexP[0]) + i) && (indexB[1] == parseInt(indexP[1]) - i)) kingsMove = true
                            if ((indexB[0] == parseInt(indexP[0]) + i) && (indexB[1] == parseInt(indexP[1]) + i)) kingsMove = true
                        }
                        if (kingsMove) console.log("AA")

                        // if (kingsMove) {
                        //     enemy = intersectsB[0].object
                        //     let enemyVectorX = parseInt(indexB[0]) - parseInt(indexP[0])
                        //     let enemyVectorY = parseInt(indexB[1]) - parseInt(indexP[1])
                        //     let checkVector = (parseInt(indexP[0]) + (2 * enemyVectorX)) + "x" + (parseInt(indexP[1]) + (2 * enemyVectorY))
                        //     let bezpiecznik = true
                        //     for (let i = 0; i < game.scene.children[2].children.length; i++) if (game.scene.children[2].children[i].name == checkVector) bezpiecznik = false
                        //     if (bezpiecznik) {
                        //       no  net.kill(checkVector, game.clicked.name, intersects[0].object.name)
                        //         game.clicked.name = checkVector
                        //         var index = game.scene.children[2].children.indexOf(intersectsB[0].object);
                        //         if (index > -1) {
                        //             game.scene.children[2].children.splice(index, 1);
                        //         }
                        //         for (let i = 0; i < game.scene.children[1].children.length; i++) {
                        //             if (game.scene.children[1].children[i].name == checkVector) {
                        //                 game.clicked.position.x = game.scene.children[1].children[i].position.x
                        //                 game.clicked.position.z = game.scene.children[1].children[i].position.z
                        //             }
                        //         }
                        //         if (game.flag == 0) {
                        //             game.clicked.material = Settings.blackMaterial
                        //             if (checkVector[0] == "7") {
                        //                 game.clicked.class = "king"
                        //                 game.clicked.rotation.x = 45
                        //             }
                        //         } else if (game.flag == 1) {
                        //             game.clicked.material = Settings.whiteMaterial
                        //             if (checkVector[0] == "0") {
                        //                 game.clicked.class = "king"
                        //                 game.clicked.rotation.x = 45
                        //             }
                        //         }
                        //         net.tura++
                        //         net.tura = net.tura % 2
                        //         game.clicked = null
                        //         let wygrana = true
                        //         game.scene.children[2].children.forEach(element => {
                        //             if (game.flag == 0) {
                        //                 if (element.nazwa == "whiteCylinder") wygrana = false
                        //             } else {
                        //                 if (element.nazwa == "blackCylinder") wygrana = false
                        //             }
                        //         });
                        //         if (wygrana) {
                        //             console.log("WYGRAŁEŚ")
                        //         }
                        //         net.realGame()
                        //     }
                        // }






                        // }
                    } else {
                        //ruch pionka
                        if (intersects.length > 0) {
                            if (intersects[0].object.nazwa == "blackMesh") {
                                let indexB = intersects[0].object.name.split("x")
                                let indexP = game.clicked.name.split("x")
                                //sprawdzenie poprawności ruchu 
                                if (game.clicked.class = "man") {
                                    if (((indexB[0] == parseInt(indexP[0]) - 1) && (indexB[1] == parseInt(indexP[1]) - 1)) || ((indexB[0] == parseInt(indexP[0]) - 1) && (indexB[1] == parseInt(indexP[1]) + 1)) || ((indexB[0] == parseInt(indexP[0]) + 1) && (indexB[1] == parseInt(indexP[1]) - 1)) || ((indexB[0] == parseInt(indexP[0]) + 1) && (indexB[1] == parseInt(indexP[1]) + 1))) {
                                        //sprawdzenie, czy tam już czegoś nie ma
                                        let bezpiecznik = true
                                        let enemy
                                        for (let i = 0; i < game.scene.children[2].children.length; i++) {
                                            if (game.scene.children[2].children[i].name == intersects[0].object.name) {
                                                bezpiecznik = false
                                                if (game.scene.children[2].children[i].nazwa != game.clicked.nazwa) {
                                                    enemy = game.scene.children[2].children[i]
                                                }
                                            }
                                        }
                                        if (bezpiecznik) {
                                            net.action(intersects[0].object.name, game.clicked.name)
                                            game.clicked.name = intersects[0].object.name
                                            game.clicked.position.x = intersects[0].object.position.x
                                            game.clicked.position.z = intersects[0].object.position.z
                                            if (game.flag == 0) {
                                                game.clicked.material = Settings.blackMaterial
                                                if (indexB[0] == "7") {
                                                    game.clicked.class = "king"
                                                    game.clicked.rotation.x = 45
                                                }
                                            } else if (game.flag == 1) {
                                                game.clicked.material = Settings.whiteMaterial
                                                if (indexB[0] == "0") {
                                                    game.clicked.class = "king"
                                                    game.clicked.rotation.x = 45
                                                }
                                            }
                                            net.tura++
                                            net.tura = net.tura % 2
                                            game.clicked = null
                                            net.realGame()
                                        } else {
                                            console.log("coś tam jest")
                                        }
                                    }
                                } else if (game.clicked.class = "king") {

                                }
                            }
                        }
                    }





                }
            }
        })
    }
    change(data) {

        let indexB = data.answer.indexB
        let indexP = data.answer.indexP
        var x
        var z
        for (let i = 0; i < game.scene.children[1].children.length; i++) {
            if (game.scene.children[1].children[i].name == indexB) {
                x = game.scene.children[1].children[i].position.x
                z = game.scene.children[1].children[i].position.z
            }
        }
        for (let i = 0; i < game.scene.children[2].children.length; i++) {
            if (game.scene.children[2].children[i].name == indexP) {
                game.scene.children[2].children[i].position.x = x
                game.scene.children[2].children[i].position.z = z
                game.scene.children[2].children[i].name = indexB
            }
        }
    }
    kill(data) {

        let where = data.answer.where
        let what = data.answer.what
        let dead = data.answer.dead
        var x
        var z
        for (let i = 0; i < game.scene.children[1].children.length; i++) {
            if (game.scene.children[1].children[i].name == where) {
                x = game.scene.children[1].children[i].position.x
                z = game.scene.children[1].children[i].position.z
            }
        }
        for (let i = 0; i < game.scene.children[2].children.length; i++) {
            if (game.scene.children[2].children[i].name == what) {
                game.scene.children[2].children[i].position.x = x
                game.scene.children[2].children[i].position.z = z
                game.scene.children[2].children[i].name = where
            } else if (game.scene.children[2].children[i].name == dead) {
                game.scene.remove(game.scene.children[2].children[i])
            }
        }
        game.scene.children[2].children.forEach(element => {
            if (element.name == what) {
                element.position.x = x
                element.position.z = z
                element.name = where
            } else if (element.name == dead) {
                var index = game.scene.children[2].children.indexOf(element);
                if (index > -1) {
                    game.scene.children[2].children.splice(index, 1);
                }
            }
        });
        let przegrana = true
        game.scene.children[2].children.forEach(element => {
            if (game.flag == 0) {
                if (element.nazwa == "blackCylinder") przegrana = false
            } else {
                if (element.nazwa == "whiteCylinder") przegrana = false
            }
        });
        if (przegrana) {
            console.log("PRZEGRAŁEŚ")
        }

    }
}