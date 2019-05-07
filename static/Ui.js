class Ui {

    constructor() {
        console.log("class Ui")
        this.sendData()
        this.resetServer()
        this.showTable()
    }
    sendData() {
        document.getElementById("login").addEventListener("click", function () {

            var name = document.getElementById("input").value
            if (name != "") {
                net.sendData(name)
            }

        })
    }
    resetServer() {
        document.getElementById("reset").addEventListener("click", function () {
            net.resetServer()
        })
    }
    showTable() {
        document.getElementById("showTable").addEventListener("click", function () {
            document.getElementById("header").innerHTML = game.pionkiTab.toString()
        })
    }
}