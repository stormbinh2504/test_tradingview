import React, { Component } from "react";

import "./sidebar.css";

import sidebar_items from "../../assets/JsonData/sidebar_routes.json";
import { Link } from "react-router-dom";

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const activeItem = sidebar_items.findIndex(
      (item) => item.route === this.props.location.pathname
    );

    return (
      <div className="sidebar" id="sidebar">
        <div style={{paddingTop: "20px"}}>
          {sidebar_items.map((item, index) => (
            <Link to={item.route} key={index}>
              <SidebarItem
                title={item.display_name}
                icon={item.icon}
                active={index === activeItem}
              />
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

class SidebarItem extends Component {
  render() {
    const active = this.props.active ? "active" : "";
    return (
      <div className="sidebar__item">
        <div className={`sidebar__item-inner ${active}`}>
          <i className={this.props.icon}></i>
          <span>{this.props.title}</span>
        </div>
      </div>
    );
  }
}

export default Sidebar;
