import React, { Component } from "react";
import { Link } from "react-router-dom";

import Dropdown from "../dropdown/Dropdown";

import user_image from "../../assets/images/binh.png";

import user_menu from "../../assets/JsonData/user_menus.json";
import notifications from "../../assets/JsonData/notification.json";

import "./topnav.css";
import ThemeMenu from "../thememenu/ThemeMenu";
import Language from "../language/Language";
var isTogglesidebar = true;

class TopNav extends Component {
  renderUserToggle = (user) => (
    <div className="topnav__right-user">
      <div className="topnav__right-user__image">
        <img src={user.image} alt="" />
      </div>
      <div className="topnav__right-user__name">{user.display_name}</div>
    </div>
  );

  renderUserMenu = (item, index) => (
    <Link to="/" key={index}>
      <div className="notification-item">
        <i className={item.icon}></i>
        <span>{item.content}</span>
      </div>
    </Link>
  );

  onActiveclass = () => {
    let sidebartoggle = document.getElementById("sidebar");
    if (isTogglesidebar) {
      sidebartoggle.style.display = "none";
      isTogglesidebar = false;
    } else {
      sidebartoggle.style.display = "block";
      isTogglesidebar = true;
    }
  };

  render() {
    const curr_user = {
      display_name: "Binh Huun",
      image: user_image,
    };

    return (
      <div className="topnav">
        <div className="topnav__iconnav" onClick={this.onActiveclass}>
          <i className="bx bx-list-ul"></i>
        </div>
        <div className="topnav__search">
          <input type="text" placeholder="Search here..." />
          <i className="bx bx-search"></i>
        </div>
        <div className="topnav__right">
          <div className="topnav__right-item">
            <Language></Language>
          </div>
          <div className="topnav__right-item">
            <ThemeMenu></ThemeMenu>
          </div>
          <div className="topnav__right-item">
            <Dropdown
              icon="bx bx-bell"
              customToggle={() => this.renderUserToggle(curr_user)}
              contentData={user_menu}
              renderItems={(item, index) => this.renderUserMenu(item, index)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TopNav;
