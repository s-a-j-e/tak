import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Lobby from './lobby';
import LeaderboardTable from '../../containers/Home/leaderboard_table';
import LobbyTable from '../../containers/Home/lobby_table';
import { connect } from 'react-redux';
import axios from 'axios';
import Leaderboard from './Leaderboard';

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
import GameSetup from './Modals/GameSetup';
import GameLink from './Modals/GameLink';
import generateRoomName from './roomNames';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: '',
      gameType: '',
      url: '',
      link: '',
      leaderboard: []
    };
    this.handleCreateGame = this.handleCreateGame.bind(this);
    this.changeView = this.changeView.bind(this);
    this.getLeaderboard();
  }

  changeView(modalView) {
    this.setState({
      modalView
    });
  }

  handleCreateGame(time, boardSize, isFriendly, isPrivate, roomName) {
    if (!roomName) {
      roomName = generateRoomName();
    }
    const { socket, username } = this.props;
    socket.emit('createGame', {
      time,
      username,
      boardSize,
      isFriendly,
      isPrivate,
      roomName
    });

    socket.on('gameInitiated', ({ roomId }) => {
      let url = `http://localhost:3000/game/${roomId}`;
      let link = `game/${roomId}`;
      this.setState({
        url,
        link,
        modalView: 'GameLink'
      });
    });
  }

  getLeaderboard() {
    axios.get('/leaderboard').then(board => {
      this.setState({ leaderboard: board.data });
    });
  }

  render() {
    return (
      <div className="takless">
        <div className="main">
          <div className="lobby">
            <Lobby socket={this.props.socket} />
          </div>
          <button className="createGame">Play with Bot</button>
          <button
            className="createGame"
            onClick={() =>
              this.setState({
                modalView: 'GameSetup',
                gameType: 'general'
              })
            }
          >
            Create Game
          </button>
          <button
            className="createGame"
            onClick={() => {
              this.setState({
                modalView: 'GameSetup',
                gameType: 'friend'
              });
            }}
          >
            Play with friend
          </button>

          <GameSetup
            modalView={this.state.modalView}
            gameType={this.state.gameType}
            changeView={this.changeView}
            handleCreateGame={this.handleCreateGame}
          />
          <GameLink
            time={this.state.time}
            modalView={this.state.modalView}
            gameType={this.state.gameType}
            changeView={this.changeView}
            url={this.state.url}
            link={this.state.link}
          />

          <Leaderboard leaderboard={this.state.leaderboard} />
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

export default withRouter(connect(mapStateToProps)(Home));
