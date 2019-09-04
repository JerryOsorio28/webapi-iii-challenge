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

// function validateUserId (req, res, next){
//   if(req.url === '/')
// }

// <------------------------------------------------------------------------- GET REQUESTS ----------------
//Returns an array of all the post objects contained in the database.
server.get('/api/users', (req, res) => {
  userDatabase.get()
  .then( posts => res.status(200).json(posts))
  .catch(err => res.status(500).json({
    message: "The posts info couldn't be retrieved",
    error: err
  }))
})
//<------------------------------------------------------------------------- POST REQUESTS ----------------
//Creates a post using the information sent inside the request body.
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

//add your middleware used globally here
server.use(logger)


server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`)
  });



//Log in which port our server is listening for traffic
server.listen(port , () => {
    console.log(`server listening on port ${port}`);
});
