//Pulls express dependency
const express = require('express');

//Run our server under the express depencency
const server = express();

//Teaches express to parse JSON
server.use(express.json()) 
//add your middleware used globally here
server.use(logger)

const userRouter = require('./users/userRouter.js');
server.use('/api/users', userRouter);


server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`)
  });

//custom middleware that logs to the console the request method, request url, and a timestamp it ws requested.
function logger(req, res, next) {
    console.log(
      `[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get('Origin')}`
    )
    next();
  };

module.exports = server;
