import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Analytics from "../pages/Analytics";
import Customer from "../pages/Customer";
import DashBoard from "../pages/DashBoard";
import ReactGridLayout from "../pages/ReactGridLayout";
import TradingView from "../pages/TradingView";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={DashBoard}></Route>
        <Route path="/customers" component={Customer}></Route>
        <Route path="/react-grid-layout" component={ReactGridLayout}></Route>
        <Route path="/trading-view" component={TradingView}></Route>
        <Route path="/analytics" component={Analytics}></Route>
      </Switch>
    );
  }
}

export default Routes;
