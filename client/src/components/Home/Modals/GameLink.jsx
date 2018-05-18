import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
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

class GameLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      time: ""
    };
  }
  render() {
    const { modalView, changeView, gameType, url, link } = this.props;
    let urlField;
    let header;
    if (gameType === "friend") {
      urlField = (
        <div>
          <div>
            <Form.Field>
              <label>{url}</label>
              <CopyToClipboard
                text={url}
                onCopy={() => this.setState({ copied: true })}
              >
                <span>
                  <Icon name="paste" size="large" />
                </span>
              </CopyToClipboard>
            </Form.Field>
          </div>
          <div id="copied">
            {this.state.copied ? "copied" : "Click to copy"}
          </div>
        </div>
      );
      header = "Click the Link Below";
    } else {
      urlField = (
        <Form.Field>
          <label>Game is created!</label>
        </Form.Field>
      );
      header = "New Game Created";
    }

    return (
      <Modal
        open={modalView === "GameLink"}
        size={"tiny"}
        closeIcon
        dimmer={false}
        onClose={() => changeView("")}
      >
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
          <Form size={"tiny"} key={"small"} />
          {urlField}
        </Modal.Content>
        <Modal.Actions>
          <Link to={{ pathname: link, query: this.props.time }}>
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
    );
  }
}

export default GameLink;
