//Pulls express dependency
const express = require('express');

//Run our server under the express depencency
const server = express();

//Teaches express to parse JSON
server.use(express.json()) 

//Assign port that our server will be listening for traffic
const port = 8000;

//importing Database
const userDatabase = ('./users/userDb.js')
const postsDatabase = ('./posts/postDb.js')

//custom middleware
function logger(req, res, next) {
    console.log(
      `[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get('Origin')}`
    )
    next();
  };

server.get('/', logger, (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`)
  });



//Log in which port our server is listening for traffic
server.listen(port , () => {
    console.log(`server listening on port ${port}`);
});
