


const Router = require('express').Router
const passport = require('passport');
const User = require('../model/User');
const signUpController = require('../controllers/signupController')
const cfg = require('../controllers/config')
const setupPassport = require('../config/passport')


const app = Router()
  // Task1 begins here

  app.get('/', (req, res) => {
    res.status(200).json({ status: 'success'});
  });
  
  let data = []
  app.post('/data',(req, res) => {
    let post = req.body.data
    data.push(post)
     res.json({post: 'this is how we role'})
     res.status(200)
  })
  
  app.get('/data', (req, res) => {
   res.status(200).json({data:data});
  })
// Task 1 ends here



app.use(passport.initialize())
app.use(passport.session())

setupPassport(app)

app.get('/', (req, res) => {
  console.log('Yay')
  res.json('welcome to authenticating jwt')
});

app.post('/signup', signUpController)

app.post('/login', passport.authenticate('local'), function (req, res)  {
  if (req.user) {
    return res.status(200).json({
      message: 'Successful login',
      success: 'true',
      user: req.user
    })
  }
  return res.status(401).json({
    message: 'Unauthorized Access',
    success: false
  })
})

// app.get('/profile', passport.authenticate('local', {
//   session: false
// }), (req, res) => {
//   res.json({
//     user: user.req
//   });
// });
// app.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// })

module.exports = app


    



  
 