import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Lobby from "./lobby";
import LeaderboardTable from "../../containers/Home/leaderboard_table";
import LobbyTable from "../../containers/Home/lobby_table";
import { connect } from "react-redux";
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
import GameSetup from "./Modals/GameSetup";
import GameLink from "./Modals/GameLink";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: "",
      gameType: "",
      url: "",
      link: ""
    };
    this.handleCreateGame = this.handleCreateGame.bind(this);
    this.changeView = this.changeView.bind(this);
  }

  changeView(modalView) {
    this.setState({
      modalView
    });
  }

  handleCreateGame(time, boardSize, isPrivate) {
    if (boardSize) {
      const { socket, username } = this.props;
      socket.emit("createGame", {
        time,
        username,
        boardSize,
        isPrivate
      });
      socket.on("gameInitiated", ({ roomId, time }) => {
        let url = `http://localhost:3000/game/${roomId}`;
        let link = `game/${roomId}`;
        this.setState({
          url,
          link,
          modalView: "GameLink"
        });
      });
    } else {
      alert("Board size cannot be empty");
    }
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
                modalView: "GameSetup",
                gameType: "general"
              })
            }
          >
            Create Game
          </button>
          <button
            className="createGame"
            onClick={() => {
              this.setState({
                modalView: "GameSetup",
                gameType: "friend"
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

          <div className="leaderboard ">
            <LeaderboardTable />
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

export default withRouter(connect(mapStateToProps)(Home));
