const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose.connect('mongodb://localhost/auth_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app
  .set('view engine', 'ejs')
  .use(express.urlencoded({ extended: true }))
  .use(
    session({
      secret: 'jdakjda',
      saveUninitialized: true,
      resave: true,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .get('/', (req, res) => {
    res.render('register');
  })
  .get('/secret', (req, res) => {
    res.render('secret');
  })
  .get('/register', (req, res) => {
    res.render('register');
  })
  .get('/login', (req, res) => {
    res.render('login');
  })
  .listen(process.env.PORT || 3000, () => {
    console.log('listening');
  });
