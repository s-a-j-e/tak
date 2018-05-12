import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Game from './Game';
import Board from './Board';
import Stack from './Stack';
import Chat from './chat'; // not in use currently
import '../../styles/livegame.css';
import { convertCoord } from './gameUtil';
import {
  Input,
  Button,
  Header,
  Modal,
  Icon,
  Form,
  Select,
  Transition
} from 'semantic-ui-react';
class LiveGame extends Component {
  constructor(props) {
    super(props);
    const newGame = new Game(5);
    this.state = {
      isOpen: true,
      game: newGame,
      stone: '',
      user: props.currentUser
    };
    this.movePieces = this.movePieces.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);

    const { socket, username } = props;
    const { game } = this.state;
    socket.emit('syncGame', username); // Creates new room if not already in one
    socket.on('playerJoin', (player1, player2) => {
      game.player1 = player1;
      game.player2 = player2;
      game.activePlayer = player1;
      this.setState({
        game
      });
    });
    socket.on('updateGame', ({ col, row, stone }) => {
      this.movePieces(col, row, false, stone);
    });

    // Join an existing game. Emit the joinGame event.
    const roomID = this.props.location.pathname.split('/').pop();
    socket.emit('joinFriendGame', { room: roomID });
    socket.on('err', data => {
      this.setState({
        message: data.message
      });
    });
  }

  movePieces(col, row, isPlayerMove, stone = this.state.stone) {
    const { game } = this.state;
    game.selectStack(col, row, stone);
    if (this.state.stone !== '') {
      this.setState({
        stone: ''
      });
    }
    this.setState({
      game
    });

    if (isPlayerMove) {
      this.props.socket.emit('broadcastGameUpdate', {
        col,
        row,
        stone,
        game: game.player1
      });
    }
  }

  handleSquareClick(col, row) {
    if (this.props.username === this.state.game.activePlayer) {
      this.movePieces(col, row, true);
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
    if (this.state.stone === '') {
      this.setState({ stone: 'S' });
    } else {
      this.setState({ stone: '' });
    }
  }

  winner() {
    if (this.state.game.victor !== 0) {
      return <h3>{this.state.game[`player${this.state.game.victor}`]} wins!</h3>;
    }
  }

  render() {
    const { game, stone } = this.state;
    const { username } = this.props;
    let PlayerPieces;
    let OpponentPieces;
    
    if (!game.player1) {
      PlayerPieces = <div></div>;
      OpponentPieces = <div></div>;
    } else if (this.props.username === game.player1) {
      PlayerPieces = (
        <div>
          <button className="btn-player1-piece" onClick={() => { this.toggleStanding(); }}>
            { stone === 'S' ? 'F' : 'S' }({ game.pieces[1].F })
          </button>
          <button className="btn-player1-piece" onClick={() => { this.selectCapstone('C'); }}>
          C ({game.pieces[1].C})
          </button>
        </div>
      );
      OpponentPieces = (
        <div>
          <p>{`F(${game.pieces[2].F}) / C(${game.pieces[2].C})`}</p>
          <h5>{game.player2}</h5>
        </div>
      );
    } else {
      PlayerPieces = (
        <div>
          <button className="btn-player2-piece" onClick={() => { this.toggleStanding(); }}>
            { stone === 'S' ? 'F' : 'S' }({ game.pieces[2].F })
          </button>
          <button className="btn-player2-piece" onClick={() => { this.selectCapstone('C'); }}>
          C ({game.pieces[2].C})
          </button>
        </div>
      );
      OpponentPieces = (
        <div>
          <p>{`F(${game.pieces[1].F}) / C(${game.pieces[1].C})`}</p>
          <h5>{game.player1}</h5>
        </div>
      );
    }

    return (
      <div className="main">
        <div className="home game">
          <div className="board">
            <div className="stone-count">
            {OpponentPieces}
            </div>
            <div>{this.winner()}</div>
            <Board game={game} handleSquareClick={this.handleSquareClick} />
            <div className="stone-select">
              <div className="active-stone">{stone}</div>
              <h4>{username}</h4>
              {PlayerPieces}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.currentUser
  };
};

export default withRouter(connect(mapStateToProps)(LiveGame));
