/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import sound_brick_drop from "./Sounds/brick_drop_concrete.wav";
import Game from "./Game";
import Board from "./Board";
import Stack from "./Stack";
import Chat from "./chat"; // not in use currently
import PTN from "./PTN";
import Clock from "./Clock";
import "../../styles/livegame.css";
import { convertCoord } from "./gameUtil";
import {
  Input,
  Button,
  Header,
  Modal,
  Icon,
  Form,
  Select,
  Transition
} from "semantic-ui-react";

class LiveGame extends Component {
  constructor(props) {
    super(props);
    const newGame = new Game(6);
    this.state = {
      game: newGame,
      time: false,
      stone: "",
      isOpen: true,
      user: props.currentUser,
      myCounter: false,
      opponentCounter: false,
      myFirstClock: false,
      opponentFirstClock: false
    };
    this.movePieces = this.movePieces.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);
    this.timeOut = this.timeOut.bind(this);

    this.myFirstMove = true;
    this.opponentFirstMove = true;
    this.useTimer = true;
    // this.myFirstClockCounter = false;
    // this.opponentFirstClockCounter = false;

    const { socket, username, time } = props;
    const { roomId } = props.match.params;
    socket.emit("syncGame", {
      username,
      roomId
    });
    socket.on("playerJoin", ({ boardSize, player1, player2, time }) => {
      const game = new Game(boardSize);
      game.player1 = player1;
      game.player2 = player2;
      game.activePlayer = player1;
      game.time = time;

      //time control logic
      let shouldStartMyCounter = false;
      let shouldStartOpponentCounter = false;
      let shouldRemoveMyFirstClock = false;
      let shouldRemoveOpponentFirstClock = false;

      if (this.props.username === game.activePlayer) {
        // player1 first move
        shouldStartMyCounter = true;
        shouldStartOpponentCounter = false;
        // show myFirstClock
        shouldRemoveMyFirstClock = false;
        // not show myOpponentFristClock
        shouldRemoveOpponentFirstClock = true;
      } else {
        // player2 first move
        shouldStartMyCounter = false;
        shouldStartOpponentCounter = true;
        // not show myOpponentFristClock
        shouldRemoveMyFirstClock = true;
        // show myFirstClock
        shouldRemoveOpponentFirstClock = false;
      }

      this.setState({
        time: game.time,
        game,
        myCounter: shouldStartMyCounter,
        opponentCounter: shouldStartOpponentCounter,
        myFirstClock: shouldRemoveMyFirstClock,
        opponentFirstClock: shouldRemoveOpponentFirstClock
      });
    });
    socket.on("opponentMove", ({ col, row, stone, roomId }) => {
      if (roomId === props.match.params.roomId) {
        this.movePieces(col, row, false, stone);
      }
    });

    //Sound Effect
    // this.sounds = { brick: sound_brick_drop };
  }

  movePieces(col, row, isPlayerMove, stone = this.state.stone) {
    const { game } = this.state;
    game.selectStack(col, row, stone);
    if (this.state.stone !== "") {
      this.setState({
        stone: ""
      });
    }
    this.setState({
      game
    });
    //I am the person made the move
    if (isPlayerMove) {
      this.props.socket.emit("updateGame", {
        col,
        row,
        stone,
        roomId: this.props.match.params.roomId
      });

      if (this.myFirstMove) {
        this.myFirstMove = false;

        if (this.props.username === game.player1) {
          // Player1 finished first move
          //remove my firstClock
          this.setState({
            myFirstClock: true,
            opponentFirstClock: false
          });
        } else {
          // Player2 finished first move
          // remove both sides' first clock
          this.setState({
            myFirstClock: true,
            opponentFirstClock: true
          });
        }
      }
    } else {
      //sync the game, I am replaying opponent's move
      if (this.myFirstMove) {
        // Player2 replayed Player1's first move
        this.setState({
          myFirstClock: false,
          opponentFirstClock: true
        });
      } else if (this.opponentFirstMove) {
        // Player1 replayed Player2's first move
        this.setState({
          myFirstClock: true,
          opponentFirstClock: true
        });
      }

      // whoever you are, your opponent finished the first move
      this.opponentFirstMove = false;
    }

    // logic for the timers
    if (game.winType) {
      this.setState({
        myCounter: false,
        opponentCounter: false
      });
      return;
    }

    if (game.activePlayer !== this.props.username) {
      this.setState({
        myCounter: false,
        opponentCounter: true
      });
    } else {
      this.setState({
        myCounter: true,
        opponentCounter: false
      });
    }
  }

  handleSquareClick(col, row) {
    if (this.props.username === this.state.game.activePlayer) {
      this.movePieces(col, row, true);
      // this.play("brick");
    }
  }

  selectCapstone(stone) {
    if (this.state.game.pieces[this.state.game.toPlay].C > 0) {
      this.setState({
        stone
      });
    }
  }

  toggleStanding() {
    if (this.state.stone === "") {
      this.setState({ stone: "S" });
    } else {
      this.setState({ stone: "" });
    }
  }

  winner() {
    let winner = this.state.game.victorUsername;
    let loser = this.state.game.loserUsername;
    if (this.state.game.winType === "1/2") {
      return <p>{`It's a Draw! ${winner} wins!`}</p>;
    } else if (
      this.state.game.winType === "1/2" &&
      this.state.game.isBoardFull
    ) {
      return (
        <div>
          <p>
            Board is Full <br />
          </p>
          <p>{`It's a Draw! ${winner} wins!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "R") {
      return (
        <div>
          <p>
            Road Complited <br />
          </p>
          <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "F" && this.state.game.isBoardFull) {
      return (
        <div>
          <p>
            Board is Full <br />
          </p>
          <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "F") {
      return (
        <div>
          <p>
            A Player Ran Out of Pieces <br />
          </p>
          <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "T") {
      // timeout situation
      return (
        <div>
          <p>
            {`Player ${loser} ran out of time`}
            <br />
          </p>
          <p>{`Player ${winner} wins!`}</p>
        </div>
      );
    } else if (this.state.game.winType !== null) {
      return <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>;
    }
  }

  opponentTurn() {
    const { activePlayer } = this.state.game;
    if (activePlayer !== this.props.username) {
      return <div className="to-play">Waiting for Opponent...</div>;
    }
    return <div className="to-play" />;
  }

  userTurn() {
    const { activePlayer } = this.state.game;
    if (activePlayer === this.props.username) {
      return <div className="to-play">Your turn</div>;
    }
    return <div className="to-play" />;
  }

  //play sounds function
  play(src) {
    var sound = new Audio(this.sounds[src]);
    sound.play();
  }

  timeOut(player) {
    let game = this.state.game;
    game.timeOut(player);
    this.setState({
      game,
      myCounter: false,
      opponentCounter: false
    });
  }

  render() {
    if (this.state.time === -1) {
      this.useTimer = false;
    }

    const { game, stone } = this.state;
    const { username, socket, time } = this.props;

    let PlayerPieces;
    let OpponentPieces;
    let opponentName, opponentNo, playerNo, color;
    if (username === game.player1) {
      opponentName = game.player2;
      opponentNo = 2;
      playerNo = 1;
      color = "btn-player1-piece";
    } else {
      opponentName = game.player1;
      opponentNo = 1;
      playerNo = 2;
      color = "btn-player2-piece";
    }

    PlayerPieces = (
      <div className="score">
        <table>
          <tr>
            <td>{`${game.pieces[playerNo].F} / ${game.pieces[playerNo].C}`}</td>
            <td>{game[`p${playerNo}FlatScore`]}</td>
          </tr>
          <tr style={{ "font-size": "10px" }}>
            <td>Stones</td>
            <td>Score</td>
          </tr>
        </table>
      </div>
    );
    OpponentPieces = (
      <div className="score">
        <table>
          <tr style={{ "font-size": "10px" }}>
            <td>Stones</td>
            <td>Score</td>
          </tr>
          <tr>
            <td>{`${game.pieces[opponentNo].F} / ${
              game.pieces[opponentNo].C
            }`}</td>
            <td>{game[`p${opponentNo}FlatScore`]}</td>
          </tr>
        </table>
      </div>
    );

    if (!game) {
      return <div />;
    }
    return (
      <div className="takless">
        <div className="game-info">
          <div>
            {/*Opponent's clock*/}
            {this.useTimer ? (
              <Clock
                time={this.state.time}
                player={opponentName}
                shouldCount={
                  this.state.opponentCounter && !this.opponentFirstMove
                }
                timeOut={this.timeOut}
              />
            ) : (
              ""
            )}
          </div>
          <div>
            {/*Opponent's first move clock */}
            {/*count down when player joined, 
              removed when placed the stone and it's opponent's turn
            */}
            {this.useTimer ? (
              <Clock
                time={20}
                player={username}
                shouldCount={this.state.opponentCounter}
                timeOut={this.timeOut}
                removed={this.state.opponentFirstClock}
              />
            ) : (
              ""
            )}
          </div>
          <div>{this.winner()}</div>
          {this.opponentTurn()}
          <table>
            {OpponentPieces}
            <tr>{opponentName}</tr>
            <PTN ptn={this.state.game.ptn} />
            <tr>{this.props.username}</tr>
            {PlayerPieces}
          </table>
          {this.userTurn()}
          <div>
            {/* first move clock */}
            {this.useTimer ? (
              <Clock
                time={20}
                player={username}
                shouldCount={this.state.myCounter}
                timeOut={this.timeOut}
                removed={this.state.myFirstClock}
              />
            ) : (
              ""
            )}
          </div>
          <div>
            {this.useTimer ? (
              <Clock
                time={this.state.time}
                player={username}
                shouldCount={this.state.myCounter && !this.myFirstMove}
                timeOut={this.timeOut}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="main">
          <div className="game">
            <div className="board">
              <Board game={game} handleSquareClick={this.handleSquareClick} />
            </div>
            <div className="stone-select">
              <div className="active-stone">{stone}</div>
              <button
                className={color}
                onClick={() => {
                  this.toggleStanding();
                }}
              >
                {stone === "S" ? "F" : "S"}({game.pieces[playerNo].F})
              </button>
              <button
                className={color}
                onClick={() => {
                  this.selectCapstone("C");
                }}
              >
                C ({game.pieces[playerNo].C})
              </button>
            </div>
          </div>
        </div>
        <Chat socket={socket} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.currentUser,
    time: state.time
  };
};

export default withRouter(connect(mapStateToProps)(LiveGame));
