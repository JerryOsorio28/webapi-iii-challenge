const express = 'express';

//importing userDatabase
const userDatabase = require('./users/userDb');
//importing postDatabase
const postsDatabase = require('./posts/postDb');

const router = express.Router();

  //<------------------------------------------------------------------------- POST REQUESTS ----------------
  //Creates a user using the information sent inside the request body.
  router.post('/', validateUser, (req, res) => {
  
    userDatabase.insert({name})
      .then(user => {
        res.status(201).json({
          message: "User created successfully",
          user: user
        })
      })
      .catch(err => res.status(500).json({
        error: "Please provide at least a name to the user",
        err: err
      }))
})

  //Creates a post using the information sent inside the request body.
  router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  
    const post = req.body; //fetch post ID from body
  
    postsDatabase.insert(post)
        .then(posts => {
        res.status(201).json({
            message: "Post created successfully",
            posts: posts
        })
        })
        .catch(err => res.status(500).json({
        error: "There was an error adding the post",
        err: err
        }))
  })

//<------------------------------------------------------------------------- GET REQUESTS ----------------
//Returns an array of all the USERS objects contained in the database.
router.get('/', (req, res) => {
    userDatabase.get()
    .then( users => res.status(200).json(users))
    .catch(err => res.status(500).json({
      message: "The users info couldn't be retrieved",
    }))
  })
  
//Returns the user object with the specified id.
router.get('/:id', validateUserId, (req, res) => {

    res.status(200).json(req.user)

})

router.get('/:id/posts', validateUserId, (req, res) => {
  
    const { id } = req.body; //fetch post ID from body
  
        userDatabase.getUserPosts(id)
          .then(posts => {
            res.status(200).json(posts)
          })
          
          .catch(err => res.status(500).json({
            error: "Error getting user posts",
            err: err
          }))
  })
// <------------------------------------------------------------------------- DELETE REQUESTS ----------------
  //Removes the post with the specified id and returns the deleted post object.
  router.delete('/api/users/:id', validateUserId, (req, res) => {
  
    const { id } = req.params; // fetchs user id;

    userDatabase.remove(id)
      .then(() => res.status(204).end())
      .catch(err => res.status(500).json({
        error: "User could not be removed"
      }))
})
// <------------------------------------------------------------------------- PUT REQUESTS ----------------
  //Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.
  router.put('/:id', validateUserId, (req, res) => {
  
    const { id } = req.params; // fetchs user's ID.
    const { name } = req.body; // fetchs updated name of user. 

    userDatabase.update(id, { name })
        .then(() => {
            userDatabase.getById(id)
            .then(user => {
                res.status(200).json({
                    message: "User updated sucessfully",
                    user: user
                })
            })
            .catch( err =>{
                res.status(500).json({
                    error: "Error getting user"
                })
            })
        })
        .catch( err => {
            res.status(500).json({
                erorr: " Error getting updating user"
            })
        })
  })
//<----------------------------custom middleware--------------------
  function validateUserId(req, res, next) {

    const { id } = req.params; // fetchs user's ID.

    userDatabase.getById(id)
        .then(user => {
            if(user){
                req.user = user;
               next();
            }else{
                res.status(404).json({
                    error: "User with id does not exist"
                })
            }
        })
  };

function validateUser(req, res, next) {

    const { name } = req.body;

    if(!name){
        return res.status(400).json({ error: "Name required"})
    }
    if(name !== 'string'){
        return res.status(400).json({ error: "Name must be a string"})
    }
    req.body = { name }
    next();
};

function validatePost(req, res, next) {
    const { id: user_id } = req.params;
    const { text } = req.body;

    if(!req.body){
        return res.status(400).json({
            error: "Post requires body"
        })
    }
    if(!text){
        return res.status(400).json({
            error: "Post requires text"
        })
    }

    req.body = { user_id, text };
    next();
};

module.exports = router;
