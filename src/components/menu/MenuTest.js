import React, { Component, Fragment } from "react";
import GroupMenu from "./GroupMenu";
import { Link, withRouter } from "react-router-dom";
// import "./menu.css";
import { Collapse } from "reactstrap";

class MenuGroup extends Component {
  render() {
    const { name, link } = this.props;
    return (
      <Link to={link} className="menu-link">
        {name}
      </Link>
    );
  }
}

class MenuSide extends Component {
  render() {
    const { name, link } = this.props;
    return (
      <Link to={link} className="menu-link active">
        {name}
      </Link>
    );
  }
}

class SubMenu extends Component {
  render() {
    const { name, link } = this.props;
    return (
      <li className="sub-menu">
        <Link to={link} className="sub-menu-link active">
          {name}
        </Link>
      </li>
    );
  }
}

class MenuTest extends Component {
  render() {
    const { menus } = this.props;
    console.log("menus", menus);
    return (
      <div className="navbar">
        <div className="navbar__submenu">
          {menus.map((menu, index) => {
            return (
              <div className="navbar__submenu-btn">
                <Link to={menu.link}>{menu.text}</Link>
                <div className="navbar__dropmenu">
                  {menu.children &&
                    menu.children.map((submenu, index) => {
                      return (
                        <>
                          <Link
                            to={submenu.link}
                            className="navbar__dropmenu-item"
                          >
                            {submenu.text}
                          </Link>
                          <div className="next-submenu">
                            {submenu.children &&
                              submenu.children.map((submenu, index) => {
                                return (
                                  <>
                                    <Link to={submenu.link}>
                                      {submenu.text}
                                    </Link>{" "}
                                  </>
                                );
                              })}
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      // <Fragment>
      //   <ul className="sidebar-menu">
      //     {menus.map((group, groupIndex) => {
      //       return (
      //         <MenuGroup name={group.name} link={group.link}>
      //           {/* {group.subMenus &&
      //             group.subMenus.map((submenu, index) => {
      //               return <Link to={submenu.link}>{submenu.name}</Link>;
      //             })} */}
      //           {group.subMenus &&
      //             group.subMenus.map((subMenu, subMenuIndex) => {
      //               return (
      //                 <SubMenu
      //                   key={subMenuIndex}
      //                   name={subMenu.name}
      //                   link={subMenu.link}
      //                 ></SubMenu>
      //               );
      //             })}
      //         </MenuGroup>
      //       );
      //     })}
      //   </ul>
      // </Fragment>
    );
  }
}

export default MenuTest;
