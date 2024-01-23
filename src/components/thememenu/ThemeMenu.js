import React, { Component } from "react";
import "./thememenu.css";
import { connect } from "react-redux";
import { setMode } from "../../redux/actions/ThemeAction";

class ThemeMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "theme-mode-light",
    };
  }

  mode_settings = [
    {
      id: "light",
      name: "Light",
      background: "light-background",
      class: "theme-mode-light",
    },
    {
      id: "dark",
      name: "Dark",
      background: "dark-background",
      class: "theme-mode-dark",
    },
    {
      id: "blue",
      name: "Blue",
      background: "blue-background",
      class: "theme-mode-blue",
    },
  ];

  setMode = (mode) => {
    this.setState({ mode: mode.id });
    this.props.setModeAct(mode.class);
  };

  componentDidUpdate() {
    localStorage.setItem("themeMode", this.state.mode);
  }

  componentDidMount() {
    const themeClass = this.mode_settings.find(
      (e) => e.class === localStorage.getItem("themeMode", "theme-mode-light")
    );
    if (themeClass !== undefined) this.setState({ mode: themeClass.id });
  }

  onActiveclass = () => {
    var thememenu = document.getElementById("theme-menu");
    thememenu.classList.toggle("active");
  };

  render() {
    return (
      <div>
        <button className="dropdown__toggle" onClick={this.onActiveclass}>
          <i className="bx bx-palette"></i>
        </button>
        <div id="theme-menu" className="theme-menu">
          <h4>Theme settings</h4>
          <button className="theme-menu__close" onClick={this.onActiveclass}>
            <i className="bx bx-x"></i>
          </button>
          <div className="theme-menu__select">
            <span>Choose mode</span>
            <ul className="mode-list">
              {this.mode_settings.map((item, index) => (
                <li key={index} onClick={() => this.setMode(item)}>
                  <div
                    className={`mode-list__color ${item.background} ${
                      item.id === this.state.mode ? "active" : ""
                    }`}
                  >
                    <i className="bx bx-check"></i>
                  </div>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    setModeAct: (mode) => {
      dispatch(setMode(mode));
    },
  };
};

export default connect(null, mapDispatchToProps)(ThemeMenu);
