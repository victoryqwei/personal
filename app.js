// Import modules

var express = require("express");
var app = express();
var http = require("http");
var fs = require("fs");
var server = http.createServer(app);

var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var fs = require("fs-extra");
var io = require("socket.io")(server);
var url = require("url");

// Set title
var setTitle = require("console-title");
setTitle("Personal Server (old.victorwei.com)");

// Start server
var serverPort = process.env.PORT || 3009;
server.listen(serverPort, function () {
  console.log("Started an http server on port " + serverPort);
});

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/*", function (req, res, next) {
  res.redirect("/");
  next();
});

var public = __dirname + "/public";

// Socket.io

io.on("connection", function (socket) {
  socket.on("requestProjects", function (data) {
    fs.readdir(public + "/projects", (err, files) => {
      if (err) {
        console.log("Error finding username");
      } else {
        socket.emit("receiveProjects", files);
      }
    });
  });

  // Disconnection
  socket.on("disconnect", function () {});
});

module.exports = app;
