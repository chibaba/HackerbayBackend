
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const morgan = require('morgan')
const Sequelize = require('sequelize')
const cors = require('cors')
const passport = require('passport')
// const config = require('./config/database');
const port = process.env.PORT || 5000;
const routes = require('./routes/routes')

require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);



app.listen(port, () => {
  console.log('Server is running on port : ' + port);
})