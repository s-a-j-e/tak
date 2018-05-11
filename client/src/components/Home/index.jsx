import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Lobby from "./lobby";
import { Route, Redirect } from "react-router";
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isOpen2: false,
      username: "",
      url: false,
      linkto: false
    };
  }
  close = () => this.setState({ isOpen: false });
  handlePlayWithFriends = username => {
    const { socket } = this.props;
    const self = this;
    //get username send to server socket to create a game
    socket.emit("createGame", {
      username
    });
    socket.on("newGame", function(data) {
      let url = `http://localhost:3000/game/newGame/${data.room}`;
      let linkto = `game/newGame/${data.room}`;
      self.setState({
        url,
        linkto,
        username,
        isOpen2: false,
        isOpen3: open
      });
      //self.props.history.push(linkto);
    });
  };
  render() {
    const options = [
      { key: "8", text: "8", value: "8" },
      { key: "7", text: "8", value: "8" },
      { key: "6", text: "8", value: "8" },
      { key: "5", text: "5", value: "5" },
      { key: "4", text: "4", value: "4" },
      { key: "3", text: "3", value: "3" }
    ];
    return (
      <div className="main">
        <div className>
          <div className="home home-grid">
            <div className="lobby">
              <Lobby socket={this.props.socket} />
            </div>
            <div className="leaderboard">
              <p>Leaderboard placeholder</p>
            </div>
          </div>
        </div>
        <div className="buttonlist">
          <button
            className="mainbutton"
            onClick={() =>
              this.setState({
                isOpen: !this.state.isOpen,
                size: !this.state.size
              })
            }
          >
            Create a game
          </button>

          <button
            className="mainbutton"
            onClick={() =>
              this.setState({
                isOpen2: !this.state.isOpen2,
                size: !this.state.size
              })
            }
          >
            Play with a friend
          </button>
          <Transition animation={"pulse"} duration={100} visible={true}>
            <Modal
              open={this.state.isOpen2}
              size={"tiny"}
              closeIcon
              onClose={() => this.setState({ isOpen2: false })}
            >
              <Modal.Header>Click the link below</Modal.Header>
              <Modal.Content>
                <Form size={"tiny"} key={"small"} />
                <Form.Field>
                  <label>Username:</label>
                  <input
                    placeholder="Username"
                    value={this.state.username}
                    onChange={e => {
                      this.setState({ username: e.target.value });
                    }}
                  />
                </Form.Field>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  positive
                  icon="gamepad"
                  size="large"
                  labelPosition="right"
                  content="New Game"
                  onClick={() =>
                    this.handlePlayWithFriends(this.state.username)
                  }
                />
              </Modal.Actions>
            </Modal>
          </Transition>

          <Transition animation={"pulse"} duration={100} visible={true}>
            <Modal
              open={this.state.isOpen3}
              size={"tiny"}
              closeIcon
              onClose={() => this.setState({ isOpen3: false })}
            >
              <Modal.Header>Click the link below</Modal.Header>
              <Modal.Content>
                <Form size={"tiny"} key={"small"} />
                <Form.Field>
                  <label>{this.state.url}</label>
                </Form.Field>
              </Modal.Content>
              <Modal.Actions>
                <Link to={this.state.linkto}>
                  {" "}
                  <Button
                    positive
                    icon="gamepad"
                    size="large"
                    labelPosition="right"
                    content="Enter romm"
                  />
                </Link>
              </Modal.Actions>
            </Modal>
          </Transition>
          <button className="mainbutton">Play with the machine</button>
          <Transition animation={"pulse"} duration={100} visible={true}>
            <Modal
              open={this.state.isOpen}
              size={"tiny"}
              closeIcon
              onClose={() => this.setState({ isOpen: false })}
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
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
