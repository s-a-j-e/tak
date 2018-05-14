import React, { Component } from 'react';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messages: [],
      typing: ''
    };

    var self = this;
    const { socket } = props;
    socket.on("typing", function(data) {
      self.setState({ typing: data.author + " is typing..." });
    });

    socket.on('chat', function(data) {
      addMessage(data);
    });

    const addMessage = data => {
      this.setState({ messages: [...this.state.messages, data], typing: '' });
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      if (this.state.message) {
        const roomID = this.props.location.pathname.split("/").pop();

        socket.emit("chat", {
          author: this.props.username,
          message: this.state.message,
          room: roomID
        });
        this.setState({ message: "" });
      }
    };

    this.handleTyping = () => {
      socket.emit("typing", {
        author: this.props.username
      });
    };
    this.handleTak = ev => {
      const roomID = this.props.location.pathname.split("/").pop();
      ev.preventDefault();
      socket.emit("chat", {
        author: this.props.username,
        message: "TAK",
        room: roomID
      });
      this.setState({ message: "" });
    };
  }
  render() {
    return (
      <div id="chat">
        <div id="chat-window">
          <div id="output">
            {this.state.messages.map(message => {
              return (
                <p>
                  <strong>{message.author}</strong>: {message.message}
                </p>
              );
            })}
          </div>
          <div id="feedback">
            <p>
              <em>{this.state.typing}</em>
            </p>
          </div>
        </div>

        <input
          id="handle"
          type="text"
          placeholder="Username"
          value={this.props.username}
          onChange={ev => this.setState({ username: ev.target.value })}
        />

        <input
          id="message"
          type="text"
          placeholder="Message"
          value={this.state.message}
          onKeyPress={this.handleTyping}
          onChange={ev => this.setState({ message: ev.target.value })}
        />

        <button id="send" onClick={this.sendMessage}>
          Send
        </button>
      </div>
    );
  }
}
export default Chat;
