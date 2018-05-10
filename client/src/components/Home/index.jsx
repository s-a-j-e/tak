import React, { Component } from "react";
import { Link } from "react-router-dom";
import Lobby from "./lobby";
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
  state = {
    isOpen: false,
    isOpen2: false,
    username: ""
  };
  close = () => this.setState({ isOpen: false });
  handlePlayWithFriends = () => {
    //get username send to server socket to create a game
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
    console.log(this.state);
    return (
      <div id="page">
        <div className="main">
          <div className="home home-grid">
            <div className="lobby">
              <Lobby socket={props.socket} />
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
              <Modal.Header>Play with a friend</Modal.Header>
              <Modal.Content>
                <Form size={"tiny"} key={"small"} onSubmit={on} />
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
                <Link to="/game">
                  <Button
                    positive
                    icon="gamepad"
                    size="large"
                    labelPosition="right"
                    content="New Game"
                    onClick={() => this.handlePlayWithFriends()}
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

export default Home;
