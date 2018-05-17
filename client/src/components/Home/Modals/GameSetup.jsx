import React, { Component } from "react";
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
//connect to redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setTime } from "../../../actions/actions";

class GameSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: 0,
      time: false
    };

    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  handleBoardSizeChange(e, { value }) {
    if (value) {
      this.setState({
        boardSize: Number(value)
      });
    }
  }
  handleTimeChange(e, { value }) {
    if (value === "0") {
      this.setState({
        time: -1
      });
    } else {
      this.setState({
        time: Number(value) * 60
      });
      //this.props.setTime(value);
    }
  }
  render() {
    const options = [
      { key: "8", text: "8", value: "8" },
      { key: "7", text: "7", value: "7" },
      { key: "6", text: "6", value: "6" },
      { key: "5", text: "5", value: "5" },
      { key: "4", text: "4", value: "4" },
      { key: "3", text: "3", value: "3" }
    ];
    const time = [
      { key: "1", text: "no time control", value: "0" },
      { key: "2", text: "15", value: "15" },
      { key: "3", text: "10", value: "10" },
      { key: "4", text: "5", value: "5" },
      { key: "5", text: "3", value: "3" }
    ];
    return (
      <Modal
        open={this.props.modalView === "GameSetup"}
        size={"tiny"}
        onClose={() => this.props.changeView("")}
        dimmer={false}
        closeIcon
      >
        <Modal.Header>GameSetup</Modal.Header>
        <Modal.Content>
          <Form size={"tiny"} key={"small"} />

          <Select
            placeholder="Board Size"
            label="Board Size"
            options={options}
            onChange={this.handleBoardSizeChange}
          />
          <Select
            placeholder="Time Control"
            label="Time Control"
            options={time}
            onChange={this.handleTimeChange}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon="gamepad"
            size="large"
            labelPosition="right"
            content="New Game"
            onClick={() =>
              this.props.handleCreateGame(
                this.state.time,
                this.state.boardSize,
                this.props.gameType === "friend"
              )
            }
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setTime
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(GameSetup);
