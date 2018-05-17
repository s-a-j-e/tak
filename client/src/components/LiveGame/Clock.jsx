import React, { Component } from "react";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.owner = props.player;

    if (props.time) {
      this.state = { seconds: props.time, removed: false };
    } else {
      this.state = { seconds: 0, removed: false };
    }
    this.timer = 0;
    this.start = this.start.bind(this);
    this.countDown = this.countDown.bind(this);
  }
  // called when one of the props changed and call the render function
  static getDerivedStateFromProps(nextProps, prevState) {
    let currentState = {};

    // set the new value for the timer to the current state
    if (prevState.seconds === 0 && nextProps.time) {
      currentState.seconds = nextProps.time;
    }

    // update the remove flag to the current state
    if (prevState.removed !== nextProps.removed) {
      currentState.removed = nextProps.removed;
    }

    if (currentState) {
      console.log("Current state", currentState);
      return currentState;
    }
    return null;
  }

  start() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  pause() {
    if (this.timer) clearInterval(this.timer);

    this.timer = 0;
  }

  countDown() {
    // Check if we're at zero.
    if (this.state.seconds == 0) {
      clearInterval(this.timer);
      this.props.timeOut(this.owner);
    }

    this.setState({
      seconds: this.state.seconds - 1
    });
  }

  formatSeconds(totalSeconds) {
    var seconds = totalSeconds % 60;
    var minutes = Math.floor(totalSeconds / 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return { m: minutes, s: seconds };
  }

  render() {
    if (this.state.removed) {
      this.pause();
      return "";
    }

    let format_time = this.formatSeconds(this.state.seconds);
    if (this.props.shouldCount) {
      this.start();
    } else {
      this.pause();
    }

    return (
      <div>
        {format_time.m}:{format_time.s}
      </div>
    );
  }
}

export default Clock;
