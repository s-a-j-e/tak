import React, { Component } from 'react';
import Lobby from './lobby';
import LeaderboardTable from '../../containers/Home/leaderboard_table';
import LobbyTable from '../../containers/Home/lobby_table';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: '',
      createModalOpen: false,
      friendModalOpen: false,
      linkModalOpen: false,
      size: ''
    };
    this.handleCreateGame = this.handleCreateGame.bind(this);
    this.changeView = this.changeView.bind(this);
  }

  changeView(modalView) {
    this.setState({
      modalView
    });
  }

  handleCreateGame(isPrivate) {
    const { socket, username } = this.props;
    socket.emit('createGame', {
      username,
      boardSize: this.state.size,
      isPrivate
    });
    socket.on('gameInitiated', ({ roomId }) => {
      let url = `http://localhost:3000/game/${roomId}`;
      let linkto = `game/${roomId}`;
      this.setState({
        url,
        linkto,
        modalView: 'GameLink'
      });
    });
  }

  render() {
    const options = [
      { key: '8', text: '8', value: '8' },
      { key: '7', text: '7', value: '7' },
      { key: '6', text: '6', value: '6' },
      { key: '5', text: '5', value: '5' },
      { key: '4', text: '4', value: '4' },
      { key: '3', text: '3', value: '3' }
    ];
    return (
      <div className="main">
        <div className="home home-grid">
          <div className="lobby">
            <Lobby socket={this.props.socket} />
          </div>
          <button className="createGame">Play with Bot</button>

          <button
            className="createGame"
            onClick={() =>
              this.setState({
                createModalOpen: !this.state.createModalOpen,
                size: this.state.size
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
                size: 5
              });
            }}
          >
            Play with friend
          </button>

          <GameSetup modalView={this.state.modalView} changeView={this.changeView} handleCreateGame={this.handleCreateGame} />
          <GameLink modalView={this.state.modalView} changeView={this.changeView} url={this.state.url} linkto={this.state.linkto} />

          <div className="leaderboard">
            <LeaderboardTable />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.currentUser
  };
};

export default withRouter(connect(mapStateToProps)(Home));
