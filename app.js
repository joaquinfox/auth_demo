const express = require('express');
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

express()
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
  .get('/secret', isLoggedIn,(req, res) => {
    res.render('secret');
  })
  .get('/register', (req, res) => {
    res.render('register');
  })
  .post('/register', (req, res) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          return res.redirect('register');
        }
        passport.authenticate('local')(req, res, () => {
          res.render('secret');
        });
      }
    );
  })
  .get('/login', (req, res) => {
    res.render('login');
  })
  .post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/secret',
      failureRedirect: '/login',
    }),
    (req, res) => {}
  )
  .get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })
  .listen(process.env.PORT || 3000, () => {
    console.log('listening');
  });
