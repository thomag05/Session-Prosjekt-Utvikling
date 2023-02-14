const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
const hbs = require("hbs");
const db = require("better-sqlite3")("endusers.db")
const dotenv = require('dotenv').config()

const app = express();

const rootpath = path.join(__dirname, "www")
const hbspath = path.join(__dirname, "views")

// app.use(express.static(path.join(__dirname, "www")));
app.use(express.urlencoded({extended: true}))

const SECRET_SESSION_KEY = process.env.SECRET_SESSION_KEY;

app.use(session({
    secret: SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false //Ved false settes ikke cookie (med sessionID) før en evt gjør endringer i sesjonen
}))


app.get("/registrer", (req, res) => {
    res.sendFile(rootpath + "/registrer.html")
})

app.get("/", (req, res) => {
    if(req.session.loggedin) {
        res.sendFile(rootpath + "/index.html")
    } else {
        res.sendFile(rootpath + "/login.html")
    }
})


app.get("/listPlayers", (req, res) => {
    if(req.session.loggedin) {
        let queryPlayers = `SELECT PlayerTeam.player_id, PlayerTeam.team_id, Player.id, Player.playerName, player.email, Team.id, Team.teamName
        FROM PlayerTeam
        INNER JOIN Player on PlayerTeam.player_id = Player.id
        INNER JOIN Team on PlayerTeam.team_id = Team.id;`

        let player = db.prepare(queryPlayers).all()
        res.render(hbspath + "/pages/listPlayers.hbs", {
            Players: player
        })
    } else {
        res.sendFile(rootpath + "/login.html")
    }
})

app.post("/login", async (req, res) => {
    let login = req.body;

    let userData = db.prepare("SELECT * FROM Player WHERE email = ?").get(login.email)
    if(await bcrypt.compare(login.password, userData.password)) {
        req.session.loggedin = true
        res.redirect("back")
    } else {
        res.redirect("back")
    }
})

app.post(("/NewPlayer"), async (req, res) => {
    let ans = req.body;

    let hash = await bcrypt.hash(ans.password, 10)
    console.log(ans)
    console.log(hash)
    db.prepare("INSERT INTO Player (playerName, email, password) VALUES (?, ?, ?)").run(ans.name, ans.email, hash)

    res.redirect("/registrer")
})

app.listen("3000", () => {
    console.log("Server listening at http://localhost:3000")
})