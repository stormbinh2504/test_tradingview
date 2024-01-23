import React, { Component } from "react";
import Routes from "../Routes";
import { BrowserRouter, Route } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "./layout.css";
import TopNav from "../topnav/TopNav";
import { connect } from "react-redux";
import { setMode } from "../../redux/actions/ThemeAction";
import Navbar from "../navbar/Navbar";
import Navbartest from "../navbar/Navbartest";
import Test from "../Test";
import BoardContent from "../boardcontent/BoardContent";

class Layout extends Component {
  componentDidMount() {
    localStorage.setItem("themeMode", "theme-mode-light");
    const themeClass = localStorage.getItem("themeMode");
    this.props.setModeAct(themeClass);
  }

  render() {
    const { ThemeReducer } = this.props;

    return (
      <BrowserRouter>
        <Route
          render={(props) => (
            <div className={`layout ${ThemeReducer.mode}`}>
              {/* <div className="layout theme-mode-blue"> */}
              <Sidebar {...props} />
              <div className="layout__content">
                <TopNav></TopNav>
                {/* <Navbartest></Navbartest> */}
                {/* <Navbar></Navbar> */}
                <div className="layout__content-main">
                  <Routes />
                  {/* <Test></Test> */}
                  {/* <BoardContent></BoardContent> */}
                </div>
              </div>
            </div>
          )}
        ></Route>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ThemeReducer: state.ThemeReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setModeAct: (mode) => {
      dispatch(setMode(mode));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
