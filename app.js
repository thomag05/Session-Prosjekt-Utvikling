const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
const hbs = require("hbs");
const db = require("better-sqlite3")("endusers.db")

const app = express();

app.use(express.static(path.join(__dirname, "www")));
app.use(express.urlencoded({extended: true}))

require('dotenv').config()
const SECRET_SESSION_KEY = process.env.SECRET_SESSION_KEY;

app.use(session({
    secret: SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false //Ved false settes ikke cookie (med sessionID) før en evt gjør endringer i sesjonen
}))





app.listen("3000", () => {
    console.log("Server listening at http://localhost:3000")
})