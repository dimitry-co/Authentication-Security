require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema);

const users = [];

app.get('/', (req, res) => {    
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
    
        newUser.save().then(() => {
            res.render('secrets');
        }).catch((err) => {
            console.log(err);
        });
    });
});

app.post('/login', (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({ email: email }).then((foundUser) => {
        if (foundUser) {
            bcrypt.compare(password, foundUser.password, (err, result) => {
                if (result === true) {
                    res.render('secrets');
                } else {
                    res.send('Wrong password');
                }
            });
        } else {
            res.send('User not found');
        }
    }).catch((err) => {
        console.log(err);
    });
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
