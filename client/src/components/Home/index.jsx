import React, { Component } from 'react';
import Lobby from './lobby';
import LeaderboardTable from '../../containers/Home/leaderboard_table';
import LobbyTable from '../../containers/Home/lobby_table';
import { Link, withRouter } from 'react-router-dom';
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
      friendModalOpen: false,
      linkModalOpen: false,
      size: ''
    };
  }

  handlePlayWithFriends() {
    const { socket } = this.props;
    socket.emit('createGame', {
      username: '', // TODO: Grab username from redux store
      size: this.state.size,
      friendly: true
    });
    socket.on('friendGameInitiated', function(data) {
      let url = `http://localhost:3000/game/${data.roomName}`;
      let linkto = `private/${data.roomName}`;
      this.setState({
        url,
        linkto,
        friendModalOpen: false,
        linkModalOpen: true
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

          <Transition animation={"pulse"} duration={100} visible={true}>
            <Modal
              open={this.state.createModalOpen}
              size={"tiny"}
              closeIcon
              onClose={() => this.setState({ createModalOpen: false })}
            >
              <Modal.Header>Create a game</Modal.Header>
              <Modal.Content>
                <Form size={"tiny"} key={"small"} />
                <Form.Field
                  control={Select}
                  label="Game Size"
                  options={options}
                  placeholder="Game Size"
                />
              </Modal.Content>
              <Modal.Actions>
                <Link to="/game">
                  <Button
                    positive
                    icon="gamepad"
                    size="large"
                    labelPosition="right"
                    content="Start"
                  />
                </Link>
              </Modal.Actions>
            </Modal>
          </Transition>
          <button
            className="createGame"
            onClick={() => {
              console.log(!this.state.friendModalOpen);
              this.setState({
                friendModalOpen: !this.state.friendModalOpen,
                size: 5
              });
            }}
          >
            Play with friend
          </button>

          <Transition animation={"pulse"} duration={100} visible={true}>
            <Modal
              open={this.state.friendModalOpen}
              size={"tiny"}
              onClose={() => this.setState({ friendModalOpen: false })}
              closeIcon
            >
              <Modal.Header>Play with a friend</Modal.Header>
              <Modal.Content>
                <Form size={"tiny"} key={"small"} />
                <Form.Field
                  control={Select}
                  label="Game Size"
                  options={options}
                  placeholder="Game Size"
                />
              </Modal.Content>
              <Modal.Actions>
                <Button
                  positive
                  icon="gamepad"
                  size="large"
                  labelPosition="right"
                  content="New Game"
                  onClick={() => this.handlePlayWithFriends(this.state.size)}
                />
              </Modal.Actions>
            </Modal>
          </Transition>
          <Transition animation={"pulse"} duration={100} visible={true}>
            <Modal
              open={this.state.linkModalOpen}
              size={"tiny"}
              closeIcon
              onClose={() => this.setState({ linkModalOpen: false })}
            >
              <Modal.Header>Click the Link Below</Modal.Header>
              <Modal.Content>
                <Form size={"tiny"} key={"small"} />
                <Form.Field>
                  <label>{this.state.url}</label>
                </Form.Field>
              </Modal.Content>
              <Modal.Actions>
                <Link to={this.state.linkto}>
                  <Button
                    positive
                    icon="gamepad"
                    size="large"
                    labelPosition="right"
                    content="Enter my room"
                  />
                </Link>
              </Modal.Actions>
            </Modal>
          </Transition>

          <div className="leaderboard">
            <LeaderboardTable />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
