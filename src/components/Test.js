import React, { Component } from "react";

import user_menu from "../assets/JsonData/user_menus.json";

class Test extends Component {
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
  render() {
    console.log(user_menu);
    console.log(this.mode_settings);
    return (
      <div>
        {user_menu.map((item, index) => {
          return <div>{item.content}</div>;
        })}
        {this.mode_settings.map((item, index) => {
          return <div>{item.name}</div>;
        })}
      </div>
    );
  }
}

export default Test;
