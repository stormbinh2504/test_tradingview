import React, { Component } from "react";

class DropMenu extends Component {
  render() {
    return (
      <ul>
        <li>
          <a href="#">Resources</a>
        </li>
        <li>
          <a href="#">Links</a>
        </li>
        <li>
          <a href="#">Tutorials</a>
          <ul>
            <li>
              <a href="#">HTML/CSS</a>
            </li>
            <li>
              <a href="#">jQuery</a>
            </li>
            <li>
              <a href="#">Other</a>
              <ul>
                <li>
                  <a href="#">Stuff</a>
                </li>
                <li>
                  <a href="#">Things</a>
                </li>
                <li>
                  <a href="#">Other Stuff</a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}

export default DropMenu;
