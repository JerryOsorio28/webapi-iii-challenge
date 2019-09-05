//Pulls express dependency
const express = require('express');

//Run our server under the express depencency
const server = express();

//Teaches express to parse JSON
server.use(express.json()) 

//Assign port that our server will be listening for traffic
const port = 8000;

//importing Database
const userDatabase = require('./users/userDb');
const postsDatabase = require('./posts/postDb');

//custom middleware that logs to the console the request method, request url, and a timestamp it ws requested.
function logger(req, res, next) {
    console.log(
      `[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get('Origin')}`
    )
    next();
  };
  //Verifies the user's id, if it matches, the returns the body request, if not displays and error.
function validateUserId(req, res, next) {
    if(req.url === `/api/users/1`){
      next();
    }else{
      res.send('Incorrect ID')
    }
  };
//<------------------------------------------------------------------------- GET REQUESTS ----------------
//Returns an array of all the USERS objects contained in the database.
server.get('/api/users', (req, res) => {
  userDatabase.get()
  .then( posts => res.status(200).json(posts))
  .catch(err => res.status(500).json({
    message: "The users info couldn't be retrieved",
  }))
})

//Returns the user object with the specified id.
server.get('/api/users/:id', validateUserId, (req, res) => {

    const userId = req.params.id; //fetchs user ID.

  userDatabase.getById(userId)
    .then( user => res.status(200).json(user))
    .catch(err => res.status(500).json({
      message: "The user info couldn't be retrieved",
    }))
})

//Returns an array of all the POSTS objects contained in the database.
server.get('/api/posts/', (req, res) => {

  postsDatabase.get()
    .then( post => res.status(200).json(post))
    .catch(err => res.status(500).json({
      message: "The posts info couldn't be retrieved",
    }))
})

//Return an individual post of a user by ID
server.get('/api/posts/:id', (req, res) => {

  const id = req.params.id // fetchs post's ID.

  postsDatabase.getById(id)
    .then( post => {
      if(post){
        res.status(200).json(post)
      }else{
        res.status(404).json({
          error: `User does not have ${id} posts yet`
        })
      }
    })
    .catch(err => res.status(500).json({
      message: "The post info couldn't be retrieved",
    }))
})
//<------------------------------------------------------------------------- POST REQUESTS ----------------
//Creates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {

      const newUser = req.body;

      userDatabase.insert(newUser)
        .then(user => {
          res.status(201).json({
            message: "User created successfully",
            user: user
          })
        })
        .catch(err => res.status(500).json({
          error: "Please provide at least a name to the user"
        }))
})
//Creates a post using the information sent inside the request body.
server.post('/api/users/:id/posts', (req, res) => {

  const newPost = req.body;
  let postId = req.params.id;
  let id = postId++;

      postsDatabase.insert(newPost)
        .then(newPost => {
          res.status(201).json({
            message: "Post created successfully",
            newPost: newPost,
            id: id
          })
        })
        .catch(err => res.status(500).json({
          error: "Please provide at least a text in the text field"
        }))
})
// <------------------------------------------------------------------------- PUT REQUESTS ----------------
//Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.
server.put('/api/users/:id', (req, res) => {

  const id = req.params.id; // fetchs user's ID.
  const update = req.body; // Adds the update made to the user.
  const name = req.body.name // fetchs updated name of user. 

  userDatabase.update(id, update)
    .then(update => {
      res.status(200).json({
        message: "User updated sucessfully",
        id: id,
        name: name
      })
    })
    .catch( err => {
      error: "There was an error updating user, make sure it includes name"
    })

})
// <------------------------------------------------------------------------- DELETE REQUESTS ----------------
//Removes the post with the specified id and returns the deleted post object.
server.delete('/api/users/:id', (req, res) => {

    const id = req.params.id; // fetchs user id;

    userDatabase.remove(id)
      .then(user => {
        if(user){
          res.status(200).json({
            message: "User has been deleted sucessfully"
          })
        }else{
          res.status(404).json({
            error: "User does not exist"
          })
        }
      })
      .catch(err => res.status(500).json({
        error: "User could not be removed"
      }))
})

//add your middleware used globally here
server.use(logger)


//Log in which port our server is listening for traffic
server.listen(port , () => {
    console.log(`server listening on port ${port}`);
});
