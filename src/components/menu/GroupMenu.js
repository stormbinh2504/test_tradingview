import React, { Component } from "react";
import DropMenu from "./DropMenu";
import TestJsonMenu from "../../components/TestJsonMenu";
import Menu from "./Menu";
import jsonData from "../../data/jsonData.json";

class GroupMenu extends Component {
  render() {
    const { menuobj } = this.props;
    console.log("menu", menuobj);
    return (
      <nav>
        {/* {menuobj.link} */}
        {menuobj.map((item) => {
          return (
            <li>
              <a href={item.link}>{item.text}</a>
            </li>
          );
        })}
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">WordPress</a>

            <ul>
              <li>
                <a href="#">Themes</a>
              </li>
              <li>
                <a href="#">Plugins</a>
              </li>
              <li>
                <a href="#">Tutorials</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#">Web Design</a>
            <DropMenu></DropMenu>
          </li>
          <li>
            <a href="#">Graphic Design</a>
          </li>
          <li>
            <a href="#">Inspiration</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default GroupMenu;
