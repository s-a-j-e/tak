const express = require('express');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const sharedSession = require('express-socket.io-session');

require('dotenv').config();

const db = require('../database');
const {
  logGame,
  getLeaderboard,
  getUserGames,
  getUserData
} = require('../database/queries');
const authRoutes = require('./routes/authRoutes');
const filterLobbyList = require('./lobbyHelper');

const app = express();

app.use(bodyParser());

const session = require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
});

app.use(session);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

// Implement authorization check for relevant requests, ie profile, logout, etc
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.post('/record', (req, res) => {
  logGame(req.body);
});

app.get('/leaderboard', async (req, res) => {
  const board = await getLeaderboard();
  res.json(board);
});

app.get('/users/:username/data', async (req, res) => {
  const data = await getUserData(req.params.username);
  res.json(data);
});

app.get('/users/:username/games', async (req, res) => {
  const games = await getUserGames(req.params.username);
  console.log(games[0].games);
  res.json(games);
});

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/bundle.js'));
});
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//Socket Setup
let rooms = 0;
const io = socket(server);

io.use(
  sharedSession(session, {
    autoSave: true
  })
);

io.on('connection', socket => {
  // Maintain session for anon users on App initialize
  socket.on('anonLogin', username => {
    if (!socket.handshake.session.username) {
      socket.handshake.session.username = username;
      socket.handshake.session.save();
    } else {
      socket.emit('setAnonUsername', socket.handshake.session.username);
    }
  });

  // Create a new game and save game state to room
  socket.on(
    'createGame',
    async ({
      time,
      username,
      boardSize,
      isFriendGame,
      isPrivate,
      roomName
    }) => {
      let roomId = roomName;
      if (io.sockets.adapter.rooms[roomId]) {
        roomId = Math.random()
          .toString(36)
          .slice(2, 9);
      }
      await socket.join(roomId);
      const room = io.sockets.adapter.rooms[roomId];
      room.player1 = username;
      room.activePlayer = username;
      room.boardSize = boardSize;
      room.isFriendGame = isFriendGame;
      room.isPrivate = isPrivate;
      room.spectators = {};
      room.time = time;
      socket.emit('gameInitiated', {
        roomId
      });
    }
  );

  // Serve game state on LiveGame component initialize
  socket.on('fetchGame', async ({ username, roomId }) => {
    const room = io.sockets.adapter.rooms[roomId];
    const {
      gameState,
      activePlayer,
      boardSize,
      isPrivate,
      spectators,
      time
    } = room;
    const { player1, player2 } = room;
    if (username === player1) {
      if (!player2) {
        socket.emit('pendingGame', { time, boardSize, roomId });
      } else {
        io.to(roomId).emit('syncGame', {
          boardSize,
          gameState,
          roomId,
          player1,
          player2,
          activePlayer,
          time
        });
      }
    } else if (!player2) {
      //create player 2
      await socket.join(roomId);
      room.player2 = username;
      io.to(roomId).emit('syncGame', {
        boardSize,
        gameState: 'new',
        roomId,
        player1,
        player2: room.player2,
        activePlayer,
        time
      });
    } else if (username !== player2 && isPrivate) {
      socket.emit('gameAccessDenied');
    } else {
      if (username !== player2) {
        await socket.join(roomId);
        room.spectators[username] = username;
      }
      socket.emit('syncGame', {
        boardSize,
        gameState,
        roomId,
        player1,
        player2,
        activePlayer,
        time
      });
    }

    // Update lobby
    const lobbyList = filterLobbyList(io.sockets.adapter.rooms);
    socket.broadcast.emit('updateLobby', lobbyList);
  });

  // Update game for each piece move
  socket.on('updateGame', ({ gameState, activePlayer, roomId }) => {
    const room = io.sockets.adapter.rooms[roomId];
    room.gameState = gameState;
    room.activePlayer = activePlayer;
    const { boardSize, player1, player2, time } = room;

    socket.to(roomId).emit('syncGame', {
      boardSize,
      gameState,
      player1,
      player2,
      activePlayer,
      roomId,
      time
    });
  });

  // Add 'isClosed' property to finished game and update lobby
  // win/lose/tie
  socket.on('closeGame', roomId => {
    io.sockets.adapter.rooms[roomId].isClosed = true;
    const lobbyList = filterLobbyList(io.sockets.adapter.rooms);
    socket.broadcast.emit('updateLobby', lobbyList);
  });

  // Serve lobby on Lobby component initialize
  socket.on('fetchLobby', () => {
    const lobbyList = filterLobbyList(io.sockets.adapter.rooms);
    socket.emit('updateLobby', lobbyList);
  });

  // Chat/Typing
  socket.on('chat', function(data) {
    io.to(data.room).emit('chat', data);
  });
  socket.on('typing', function(data) {
    socket.to(data.room).broadcast.emit('typing', data);
  });
});
