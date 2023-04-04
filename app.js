require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const md5 = require('md5');
const bcrypt = require('bcrypt');

const app = express();
const route = 3000;
const saltRound = 10;

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

    bcrypt.hash(req.body.password, saltRound).then( hash => {

        const newUSer = new User({
            email: req.body.username,
            password: hash
        });
    
        newUSer.save().then(() => {
            res.render('secrets');
        }).catch(err => console.log(err));

    }).catch( err => console.log(err))
    
    

});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then( foundUser => {

        if (foundUser) {
            
            bcrypt.compare(password, foundUser.password).then( result => {
                if (result === true) {
                    res.render('secrets');
                }
            }).catch( err => console.log(err))
                
            
        }

    }).catch(err => console.log(err));

});




//!LISTEN
app.listen(route, () => {
    console.log("Listening to PORT:"+ route);
});