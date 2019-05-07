var net;
var ui;
var game;
var planeOne;
$(document).ready(function () {
    planeOne = new PlaneOne()
    net = new Net()
    game = new Game()
    // utworzenie obiektu klasy Net
    ui = new Ui() // utworzenie obiektu klasy Ui

    game.init()
})
