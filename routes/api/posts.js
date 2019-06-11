const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../model/Post');

// Validation
const validatePostInput = require('../../validation/post');

//@route         GET api/posts/test
//@description   Tests post route
//@access        Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

//@route         GET api/posts
//@description   Get posts 
//@access        Public

router.get('/', (req, res) => {
  Post.find()
  .sort({ date: -1 })
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({ nopostsfound: 'No post found' }));
});

// @route       GET api/posts/:id
// @description Get post by id
// @access      Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' })
  );
});

// @route      POST api/posts
// @descripton Create post
// @access     Private
router.post(
  '/', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
     const { errors, isValid } = validatePostInput(req.body);
  
// Check Validation
if (!isValid) {
  // If any errors, send 400 with errors object
  return res.status(400).json(errors);
}

const newPost = new Post({
  text: req.body.text,
  name: req.body.name,
  avatar: req.body.avatar,
  user: req.user.id
});

newPost.save().then(post => res.json(post));
  }
);

// @route  Delete api/posts/:id
// @desc   Delete post  
// @access Private  
router.delete('/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => 
  { 
    Profile.findOne({ user: req.user.id })
  .then (profile => 
    {
      Post.findById(req.params.id)
      .then(post => {

          // Check for post owner
          if (post.user.toString() !== req.user.id) 
          {
              return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
          });
      }
  };

// @route  POST api/posts/like/:id
// @desc   Like post  
// @access Private  
router.post('/like/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => 
  { 
    Profile.findOne({ user: req.user.id })
  .then (profile => 
    {
      Post.findById(req.params.id)
      .then(post => {
         if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
           return res.status(400).json({ alreadyliked: 'User already liked this post' });
         } 
         
         //Add user ID to likes array
         post.likes.unshift({ user: req.user.id });

         post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
          });
      }
  };

// @route  POST api/posts/unlike/:id
// @desc   Unlike post  
// @access Private  
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => 
  { 
    Profile.findOne({ user: req.user.id })
  .then (profile => 
    {
      Post.findById(req.params.id)
      .then(post => {
         if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0) {
           return res.status(400).json({ notliked: 'You have not yet liked this post' });
         } 
         
         // Get remove index
         const removeIndex = post.likes
         .map(item => item.user.toString())
         .indexOf(req.user.id);

         // Splice out of array
         post.likes.splice(removeIndex, 1);

         // Save
         post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
          });
      }
    .catch(err => res.status(404).json({ postNotFound: 'No post found'}));
    });
  }
);

// @route       POST api/posts/comment/:id
// @description Add comment to post
// @access      Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
  .then(post => {
    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    }
    // Add to comments array
    post.comments.unshift(newComment);
    // Save
    post.save().then(post => res.json(post))
  })
  .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});
}
);

// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            const NewComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            // Add to comments array
// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
      .then(post => {
          const NewComment = {
              text: req.body.text,
              name: req.body.name,
              avatar: req.body.avatar,
              user: req.user.id
          }

          // Add to comments array

            
module.exports = router;




