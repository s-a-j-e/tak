// import React, { Component } from "react";
// import socketIOClient from "socket.io-client";

// const P1='X',
// const P2= 'O'

// class PlayWithFriends extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       player: {
//         name: X,
//         currentTurn: true
//       },
//       game: {
//         gameId: ""
//       }
//     };
//     this.socket = io("localhost:3000");
//   }

//   // Create a new game. Emit newGame event.
//   createGame(data) {
//     socket.emit("createGame", { name });

//   }

//  // Join an existing game on the entered roomId. Emit the joinGame event.
//  createGame(data) {
//   const name = data.name;
//   const roomID = data.roomID;
//    socket.emit('joinGame', { name, room: roomID });
// }
// }
// export default PlayWithFriends;
