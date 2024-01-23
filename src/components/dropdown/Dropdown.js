import React, { Component } from "react";
import "./dropdown.css";

import { createRef } from "react";

class Dropdown extends Component {
  constructor(props) {
    super(props);
  }

  showInfo = () => {
    var x = document.getElementById("show_info");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };

  render() {
    return (
      <div className="dropdown" onClick={this.showInfo}>
        <button id="info_user" className="dropdown__toggle">
          {this.props.customToggle ? this.props.customToggle() : ""}
        </button>
        <div id="show_info" className="dropdown__content">
          {this.props.contentData.map((item, index) =>
            this.props.renderItems(item, index)
          )}
        </div>
      </div>
    );
  }
}

export default Dropdown;
