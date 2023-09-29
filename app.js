//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
    
        newUser.save()
            .then(() => {
                res.render("secrets");
            })
            .catch(err => {
                console.log(err);
            });
    });



   
});



app.post("/login", (req, res) => {
    const username = req.body.username;
    const userPassword = req.body.password; // User's input password (not hashed)

    User.findOne({ email: username })
        .then(foundUser => {
            if (foundUser) {
                // Compare the hashed password in the database with the user's input password
                bcrypt.compare(userPassword, foundUser.password, (err, result) => {
                    if (result === true) {
                        res.render("secrets");
                    } else {
                        // Handle case where password is incorrect
                        res.render("login"); // You can render a login error message here
                    }
                });
            } else {
                // Handle case where user is not found
                res.render("login"); // You can render a login error message here
            }
        })
        .catch(err => {
            console.log(err);
            // Handle other errors, e.g., database connection issues
        });
});











app.listen(3000, () => {
    console.log("Server started on port 3000 and health is good");
});
