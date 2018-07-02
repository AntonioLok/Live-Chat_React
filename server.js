const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const session = require('express-session');

const socketIO = require('socket.io')
const app = express();

// API file for interacting with MongoDB
const api = require('./server/routes/api');


//use sessions for tracking logins
app.use(session({
  secret: 'tonyro',
  resave: true,
  saveUninitialized: false
}));

app.use(function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
          next();
    });

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//app.use(express.static(path.join(__dirname, '/build')));

// API location
app.use('/api', api);


// Send all other requests to the app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build' , 'index.html'));
});

//Set Port
const port = process.env.PORT || '8000';
app.set('port', port);
const server = http.createServer(app);

var usersOn = [];
// This creates our socket using the instance of the server
const io = socketIO(server)

io.on('connection', socket => {

  socket.on('update-users-server', (usersList) => {
    usersOn = usersList;
	//console.log(usersList);
  });

  var currentUser;

  socket.on('add-user', (username) => {
    if (usersOn.indexOf(username) != -1) return;
  	currentUser = username;
    usersOn.push(username);
    //console.log(username);
    socket.broadcast.emit('update-users-client', {users: usersOn});
  });
  
  socket.on('disconnect', () => {
    //index = usersOn.indexOf(currentUser);
    //usersOnn = usersOn.splice(index, 1)
    usersOn = usersOn.filter((element) =>{ return element !== currentUser});
    //console.log(usersOn);
    socket.broadcast.emit('update-users-client', {users : usersOn});
    console.log('user disconnected');
  });
}); 

server.listen(port, () => console.log(`Running on localhost:${port}`));