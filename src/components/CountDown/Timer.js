import React, { Component } from "react";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  onStart = () => {
    var self = this;
    // this.setState({ count: this.state.count + 1 });
    setInterval(function () {
      self.setState({ count: self.state.count + 1 });
    }, 1000);
  };

  componentDidMount() {
    clearInterval(this.state.count);
  }

  render() {
    console.log("count", this.state.count);
    return (
      <>
        <button onClick={this.onStart}>start</button>
        <div>{this.state.count}</div>
      </>
    );
  }
}

export default Timer;
