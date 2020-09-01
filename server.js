const express = require("express");
const userRouter = require("./users/userRouter.js");

const server = express();

function logger(req, res, next) {
  console.log(
    `Request method: ${req.method}, request URL: ${
      req.url
    }, timestamp: ${new Date()}`
  );
  next();
}

server.use(logger);
server.use(express.json());

server.use("/api/users", userRouter);

// test GET route
server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

// test POST route
server.post("/", (req, res) => {
  console.log(req.body);
  res.status(200).send("working route");
});

module.exports = server;
