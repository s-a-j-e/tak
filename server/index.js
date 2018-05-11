const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const bodyParser = require("body-parser");
const socket = require("socket.io");

require("dotenv").config();

const db = require("../database");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

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
app.use("/game", gameRoutes);

// Implement authorization check for relevant requests, ie profile, logout, etc
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    next();
  }
};
//app.use("/", express.static(path.join(__dirname, "../client/dist/")));

app.get("/bundle.js", (req, res) => {
  console.log("getting bundle");
  res.sendFile(path.join(__dirname, "../client/dist/bundle.js"));
});

app.get("/*", (req, res) => {
  console.log("Wildcard route, sending back index.html :)");
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//Socket Setup
let rooms = 0;
const io = socket(server);
io.on("connection", function(socket) {
  socket.leave(socket.id);

  socket.on("createOrJoinGame", async () => {
    if (Object.keys(socket.rooms).length) {
      socket.emit("updateGame", []); // TODO: send move history associated with room to client
    } else {
      await socket.join("testRoom"); // TODO: randomize roomName
      console.log("socket.rooms", socket.rooms);
      socket.to("testRoom").emit("updateGame", []);
    }
    const pendingGames = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];

      if (currentRoom.length === 1) {
        pendingGames.push({ ...currentRoom, name: room });
      }
    }
    socket.broadcast.emit("postGames", pendingGames);
  });

  socket.on("broadcastGameUpdate", data => {
    console.log("broadcastGameUpdate triggered", data);
    socket.to("testRoom").emit("updateGame", [data]);
  });

  socket.on("fetchLobby", () => {
    const games = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];
      if (currentRoom.length === 1) {
        games.push({ ...currentRoom, name: room });
      }
    }
    socket.emit("updateLobby", games);
  });

  socket.on("joinGame", name => {
    socket.join(name);
    console.log(`someone has joined ${name}`);
    console.log(`${name}: ${JSON.stringify(io.sockets.adapter.rooms[name])}`);
  });

  //Chat/Typing
  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
  socket.on("typing", function(data) {
    console.log("data", data);
    socket.broadcast.emit("typing", data);
  });

  // Create a new game room to play with friend and notify the creator of game.
  socket.on("createGame", data => {
    socket.join(`privateroom-${++rooms}`);
    socket.emit("newGame", {
      username: data.username,
      room: `privateroom-${rooms}`
    });
  });

  // Connect the Player 2 to the room he requested. Show error if room full.
  socket.on("joinFriendGame", function(data) {
    const { rooms } = io.sockets.adapter;

    console.log("rooms", rooms);
    // if (room && room.length === 1) {
    //   socket.join(data.room);
    //   socket.broadcast.to(data.room).emit("player1", {});
    //   socket.emit("player2", { room: data.room });
    // } else {
    //   socket.emit("err", { message: "Sorry, The room is full!" });
    // }
  });
});
