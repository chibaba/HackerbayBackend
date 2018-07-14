const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const morgan = require('morgan')
const Sequelize = require('sequelize')
const cors = require('cors')
const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy;
const config = require('./config/database');
const PORT = process.env.PORT || 5000;

require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes')(app, passport);
const server = app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
