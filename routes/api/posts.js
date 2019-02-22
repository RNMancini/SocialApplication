const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../model/Post');

// Validation
const validatePostInput = require('../../validation/post');

// Profile model
const Profile = require('../../models/Profile');

// @route  GET api/posts/test
// @desc   TESTS post route
// @access PUBLIC
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

router.get('/', (req, res) => {
  Post.find()
  .sort({ date: -1 })
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({ nopostsfound: 'No post found' }));
});

router.get('/', (req, res) => {
  Post.find()
  .sort({ date: -1 })
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

router.post(
  '/', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
     const { errors, isValid } = validatePostInput(req.body);
  );
  
router.delete('/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => { Profile.findOne({ user: req.user.id })
  .then(;rofile +> {
      Post.findById(req.params.id)
      .then(post => {
          // Check for post owner
          if(post.user.toString() !== req.user.id) {
              return res.status(401).json({ notauthorized: 'User not authorized' });
          }
          // Delete
          post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
          })
      })
  });

module.exports = router;
