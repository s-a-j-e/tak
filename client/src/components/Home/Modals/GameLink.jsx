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
    const options = [
      { key: '8', text: '8', value: '8' },
      { key: '7', text: '7', value: '7' },
      { key: '6', text: '6', value: '6' },
      { key: '5', text: '5', value: '5' },
      { key: '4', text: '4', value: '4' },
      { key: '3', text: '3', value: '3' }
    ];
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