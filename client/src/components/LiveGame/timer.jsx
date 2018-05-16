import React, { Component } from 'react';

class Timer extends Component{
  constructor(props){
    super(props);

    this.state = {time: 60};
    this.timeout = props.timeout
  }

  start(){
    this.timer = setInterval(countDown, 1000);
  }

  pause(){
    clearInterval(this.timer)
  }

  reset(){
    this.setState({time: 60});
  }

  countDown(){
    if(this.state.time == 0){
      timeout()
      clearInterval(this.timer);
    }
    else{
      this.setState({time: this.state.time-1});
    }
  }

  render(){
    return(
      <div>
        {this.state.time}
      </div>
    )
  }


}

export default Timer;