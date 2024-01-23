import React, { Component } from "react";
// var countDownDate = new Date("Jan 5, 2022 15:37:25").getTime();
var countDownDate = new Date("Jan 5, 2022 15:37:25").getTime();
var timeNow = new Date().getTime();

class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: undefined,
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      times: undefined,
    };
  }

  // getTime = (now, then) => {};

  // componentDidUpdate(prevState) {
  //   console.log("prevState.countDown", prevState.countDown);
  //   console.log("prevState.countDown", countDownDate);
  //   if (prevState.countDown < countDownDate) {
  //     this.getTime();
  //   }
  // }

  //   setInterval(function(){ alert("Hello"); }, 3000);

  render() {
    return <div>{this.state.count}</div>;
  }
}

export default CountDown;
