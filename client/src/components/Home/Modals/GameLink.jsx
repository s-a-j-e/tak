import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

class GameLink extends Component {
  constructor(props) {
    super(props);
    // TODO: store game setup options in local state
  }
  render() {
    return (
      <Transition animation={"pulse"} duration={100} visible={true}>
        <Modal
          open={this.props.modalView === 'GameLink'}
          size={"tiny"}
          closeIcon
          onClose={() => this.changeView('')}
        >
          <Modal.Header>Click the Link Below</Modal.Header>
          <Modal.Content>
            <Form size={"tiny"} key={"small"} />
            <Form.Field>
              <label>{this.props.url}</label>
            </Form.Field>
          </Modal.Content>
          <Modal.Actions>
            <Link to={this.props.linkto}>
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
    );
  }
}

export default GameLink;