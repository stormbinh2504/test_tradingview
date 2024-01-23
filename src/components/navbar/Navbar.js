import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import "./navbar.css";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";

import drop_menu_navbar_vi from "../../translations/vi.json";
import drop_menu_navbar_en from "../../translations/en.json";
import drop_menu_navbar_japan from "../../translations/japan.json";

class Navbar extends Component {
  dropMenu = () => {
    let text = null;
    if (this.props.language === "vi") {
      text = JSON.stringify(drop_menu_navbar_vi);
    } else if (this.props.language === "en") {
      text = JSON.stringify(drop_menu_navbar_en);
    } else {
      text = JSON.stringify(drop_menu_navbar_japan);
    }
    let obj = JSON.parse(text).account.header.dropmenunavbar;
    let result = null;
    let arr = [];
    for (let key in obj) {
      arr.push(obj[key]);
    }
    console.log(arr);
    result = arr.map((binh, index) => {
      return (
        <NavLink className="navbar__dropmenu-item"  to="/cc">
          {binh}
        </NavLink>
      );
    });
    return result;
  };

  render() {
    return (
      <div className="navbar">
        <div className="navbar__submenu">
          <NavLink className="navbar__submenu-btn active" to="/">
            <FormattedMessage id="account.header.menu.trade" />
            <div className="navbar__dropmenu">{this.dropMenu()}</div>
          </NavLink>
          <NavLink className="navbar__submenu-btn" to="/abc">
            <FormattedMessage id="account.header.menu.settings" />
          </NavLink>
          <NavLink className="navbar__submenu-btn" to="/abcd">
            <FormattedMessage id="account.header.menu.account" />
          </NavLink>
          <NavLink className="navbar__submenu-btn" to="/abcde">
            <FormattedMessage id="account.header.menu.priceboard" />
          </NavLink>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.LanguageReducer.language,
  };
};

export default connect(mapStateToProps, null)(Navbar);
// export default injectIntl(Navbar);
