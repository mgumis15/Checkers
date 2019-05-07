class Net {
    constructor() {
        this.tura = 1
    }

    sendData(name) {

        $.ajax({
            url: "/login", // uwaga - post na serwerze
            data: JSON.stringify({ action: "ADD_USER", user: name }),
            type: "POST",
            dataType: 'json',
            success: function (data) {
                if (data.answer == "include") document.getElementById("alert").innerHTML = "Jest już taki użytkownik"
                else if (data.answer == "nomore") document.getElementById("alert").innerHTML = "Jest już 2 użytkowników"
                else if (data.answer == "agree") {
                    document.getElementById("alert").innerHTML = "Witaj <b>" + data.user + "</b>"
                    for (let i = 0; i < document.getElementsByClassName("logowanko").length; i++)document.getElementsByClassName("logowanko")[i].style.display = "none"
                    document.getElementById("tekst").innerHTML = "Oczekuj na drugiego gracza"
                    game.createClones(data.flag)
                    var interval = setInterval(function () {
                        $.ajax({
                            url: "/waiting", // uwaga - post na serwerze
                            data: JSON.stringify({ action: "WAITING", user: "", flag: data.flag }),
                            type: "POST",
                            dataType: 'json',
                            success: function (data) {
                                if (data.answer) {
                                    document.getElementById("logowanko").style.display = "none"
                                    document.getElementById("header").innerHTML = "Grasz przeciwko graczowi " + data.user
                                    game.raycaster()
                                    if (game.flag == 0) net.realGame()

                                    clearInterval(interval)
                                } else {

                                }


                            },
                            error: function (xhr, status, error) {
                                console.log(xhr);
                            },
                        });
                    }, 500)
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    resetServer() {
        $.ajax({
            url: "/reset", // uwaga - post na serwerze
            data: JSON.stringify({ action: "RESET", user: "" }),
            type: "POST",
            dataType: 'json',
            success: function (data) {


            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    realGame() {
        var gameAjax = setInterval(function () {
            $.ajax({
                url: "/game", // uwaga - post na serwerze
                data: JSON.stringify({ action: "GAME", flag: game.flag, user: "", tura: net.tura }),
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    if ((data.answer == "nothingW") || (data.answer == "nothingB")) {

                    } else {

                        net.tura++
                        net.tura = net.tura % 2
                        if (data.answer.act == "go") {
                            game.change(data)
                        } else {
                            game.kill(data)
                        }

                        clearInterval(gameAjax)

                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            });
        }, 1000)
    }
    action(indexB, indexP) {
        $.ajax({
            url: "/reset", // uwaga - post na serwerze
            data: JSON.stringify({ action: "ACTION", flag: game.flag, indexB: indexB, indexP: indexP }),
            type: "POST",
            dataType: 'json',
            success: function (data) {
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    kill(where, what, dead) {
        $.ajax({
            url: "/reset", // uwaga - post na serwerze
            data: JSON.stringify({ action: "KILL", flag: game.flag, where: where, what: what, dead: dead }),
            type: "POST",
            dataType: 'json',
            success: function (data) {
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

}