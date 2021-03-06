const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcrypt.js");
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../'../validation/register');
const validateLoginInput = require('../'../validation/login');
// Load user model
const User = require('../../models/User');

// @route  GET api/users/test
// @desc   TESTS users route
// @access PUBLIC
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route  GET api/users/test
// @desc   TESTS users route
// @access PUBLIC
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
//router.post('/register', (req, res) => User.findOne({ email: req.body.email }); 

  // Check Validation
  if(!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
 .then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
      //return res.status(400).json({email: 'Email already exists'});
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        //avatar: 
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route  GET api/users/login
// @desc   Login User / Returning JWT Token
// @access Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  //if (!isValid) { return res.status(400).json(errors); }

  // Find the user by email
  User.findOne({email})
    .then(user => {
      // Check for user
      if(!user) {
        //errors.email = 'User not found';
        return res.status(404).json({email: 'User not found'});
      }

      // Check Password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch => {
          // User matched
          const payload = { id: user.id, name: user.name, avatar: user.avatar } // Create JWT Payload

          // Sign Token
          jwt.sign(
            payload, 
            keys.secretOrKey, 
            { expiresIn: 3600 }, 
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer' + token
            });
          });
      } else {
        //errors.password = 'Password incorrect';
        return res.status(400).json({password: 'Password incorrect'});
              }
          });
      });
  });

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    res.json(//{ msg: 'Success' });
              req.user);
  });

module.exports = router;