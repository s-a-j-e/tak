const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const bodyParser = require("body-parser");
const socket = require("socket.io");

require("dotenv").config();

const db = require("../database");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

// Implement authorization check for relevant requests, ie profile, logout, etc
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    next();
  }
};

app.use("/", express.static(path.join(__dirname, "../client/dist")));
app.get("/bundle.js", (req, res) => {
  console.log("getting bundle");
  res.sendFile(path.join(__dirname, "../client/dist/bundle.js"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//Socket Setup
let rooms = 0;
const io = socket(server);

io.on('connection', (socket) => {
  socket.leave(socket.id);

  socket.on("syncGame", async username => {
    // Only creates new game if not already in one
    if (!Object.keys(socket.rooms).length) {
      await socket.join(username);
      io.sockets.adapter.rooms[username].player1 = username;
    } else {
      Object.keys(socket.rooms).forEach(room => {
        gameRoom = io.sockets.adapter.rooms[room];
        io.in(room).emit("playerJoin", gameRoom.player1, username);
      });
    }

    // Find rooms with only one socket attached (i.e. pending games)
    const pendingGames = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];
      console.log("current room", currentRoom, !currentRoom.friendly);
      if (!currentRoom.friendly && currentRoom.length === 1) {
        console.log("push currentRoom", currentRoom);
        pendingGames.push({ ...currentRoom, name: room });
      }
    }
    socket.broadcast.emit("updateLobby", pendingGames);
  });

  // Update game for each piece move
  socket.on("broadcastGameUpdate", data => {
    socket.to(data.game).emit("updateGame", data);
  });

  // Serve pending game list to lobby on lobby initialize
  socket.on("fetchLobby", () => {
    const games = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];
      if (!currentRoom.friendly && currentRoom.length === 1) {
        games.push({ ...currentRoom, name: room });
      }
    }
    socket.emit("updateLobby", games);
  });

  // Join user to pending game
  socket.on("joinGame", (roomName, username) => {
    socket.join(roomName);
    io.sockets.adapter.rooms[roomName].player2 = username;
  });

  // Create a new game room to play with friend and notify the creator of game.
  socket.on("createGameWithFriend", data => {
    const roomName = `privateroom-${++rooms}`;
    socket.join(roomName);
    io.sockets.adapter.rooms[roomName].friendly = true;
    socket.emit("newGame", {
      //username: data.username,
      roomName: roomName,
      message: "waiting for player2...",
      turn: true,
      player: "player1"
    });
  });

  // Connect the Player 2 to the room he requested. Show error if room full.
  socket.on("joinFriendGame", function(data) {
    var room = io.nsps["/"].adapter.rooms[data.room];

    console.log("~~~~~~room", room);
    if (room && room.length === 1 && room.friendly) {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit("player1", {});
      socket.emit("player2", { roomName: data.roomName });
    } else {
      socket.emit("err", { message: "Sorry, The room is full!" });
    }
  });
});
