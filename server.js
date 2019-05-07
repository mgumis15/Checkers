var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var action;
var users = []
var flag = 1
var pionkiTab = [

    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
];
var actW = null
var actB = null
var killW = null
var killB = null
var server = http.createServer(function (req, res) {
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
    switch (req.method) {
        case "GET":
            if (req.url === "/") {
                fs.readFile("static/index.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data)
                    res.end();

                })
            }
            if (req.url === "/style.css") {
                fs.readFile("static/style.css", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.write(data);
                    res.end();
                })
            }

            if (req.url.indexOf(".js") != -1) {
                fs.readFile("static/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "application/javascript" });
                    res.write(data);
                    res.end();
                })
            }
            if (req.url.indexOf(".png") != -1) {
                fs.readFile("static/img/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "image/png" });
                    res.write(data);
                    res.end();
                })
            }
            if (req.url.indexOf(".jpg") != -1) {
                fs.readFile("static/img/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "image/jpeg" });
                    res.write(data);
                    res.end();
                })
            }


            break;
        case "POST":
            servResponse(req, res)
            break;
        default: break;
    }
})

function servResponse(req, res) {

    req.on("data", function (data) {
        var object = JSON.parse(decodeURI(data))
        object.answer = ""
        switch (object.action) {
            //dodanie nowego usera
            case "ADD_USER":
                addUser(object, res)
                break;
            case "RESET":
                users = []
                break;
            case "WAITING":
                wait(object, res)
                break;
            case "ACTION":
                action(object, res)
                break;
            case "KILL":
                kill(object, res)
                break;
            case "GAME":
                game(object, res)
                break;

        }
    })
}
function game(object, res) {
    if (object.flag == 1) {
        if (actW != null) {
            object.answer = actW
            object.answer.act = "go"
            actW = null
            res.end(JSON.stringify(object))

        } else if (killW != null) {
            object.answer = killW
            object.answer.act = "kill"
            killW = null
            res.end(JSON.stringify(object))
        } else {
            object.answer = "nothingW"
            res.end(JSON.stringify(object))
        }
    } else {
        if (actB != null) {
            object.answer = actB
            object.answer.act = "go"
            actB = null
            res.end(JSON.stringify(object))

        } else if (killB != null) {
            object.answer = killB
            object.answer.act = "kill"
            killB = null
            res.end(JSON.stringify(object))
        } else {
            object.answer = "nothingB"
            res.end(JSON.stringify(object))
        }
    }

}

function action(object, res) {
    if (object.flag == 0) {
        actW = { indexB: object.indexB, indexP: object.indexP }
        res.end(JSON.stringify(object))
    } else {
        actB = { indexB: object.indexB, indexP: object.indexP }
        res.end(JSON.stringify(object))
    }
}
function kill(object, res) {
    if (object.flag == 0) {
        killW = { where: object.where, what: object.what, dead: object.dead }
        res.end(JSON.stringify(object))
    } else {
        killB = { where: object.where, what: object.what, dead: object.dead }
        res.end(JSON.stringify(object))
    }
}
function addUser(object, res) {
    if (users.length == 2) {
        object.answer = "nomore"
        res.end(JSON.stringify(object));
    } else if (users.includes(object.user)) {
        object.answer = "include"
        res.end(JSON.stringify(object));
    } else {
        object.answer = "agree"
        object.flag = flag
        flag--
        users.push(object.user)
        res.end(JSON.stringify(object));
    }
}

function wait(object, res) {
    if (users.length == 2) {
        object.answer = true
        object.user = users[object.flag]
        res.end(JSON.stringify(object));
    } else {
        object.answer = false
        res.end(JSON.stringify(object));
    }
}


server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
