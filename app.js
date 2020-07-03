const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local')


express()
  .set('view engine', 'ejs')
  .use(express.urlencoded({ extended: true }));
