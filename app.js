require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();
const route = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


const User = new mongoose.model('User',userSchema);


//*TODOLIST >>>>>>>>>>>>>>>>>

app.get('/', (req, res) => {

    res.render("home");

});

app.get('/login', (req, res) => {

    res.render("login");

});


app.get('/register', (req, res) => {

    res.render("register");

});


app.post('/register', (req, res) => {
    
    const newUSer = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUSer.save().then(() => {
        res.render('secrets');
    }).catch(err => console.log(err));

});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}).then( foundUser => {

        if (foundUser) {
            if (foundUser.password === password) {
                res.render('secrets');
            }
        }

    }).catch(err => console.log(err));

});




//!LISTEN
app.listen(route, () => {
    console.log("Listening to PORT:"+ route);
});