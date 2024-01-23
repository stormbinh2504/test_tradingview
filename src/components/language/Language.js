import React, { Component } from "react";
import "./language.css";
import { connect } from "react-redux";
import { setLanguage } from "../../redux/actions/LanguageAction";

class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "vi",
    };
  }

  onHandleChange = (e) => {
    var target = e.target;
    var name = target.name;
    // var value = target.value;
    var value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.language != this.state.language) {
      this.setState({ language: this.state.language });
      localStorage.setItem("themeLanguage", this.state.language);
      this.props.setLanguageAct(this.state.language);
    }
  }

  componentDidMount() {
    const languagestorage = localStorage.getItem("themeLanguage");
    if (languagestorage !== undefined) {
      this.setState({ language: languagestorage });
      this.props.setLanguageAct(languagestorage);
    } else {
      this.props.setLanguageAct(this.state.language);
    }
  }

  render() {
    const { language } = this.state;
    return (
      <div className="aditional-info-container">
        <div className="row">
          <div className="col-3 icon-pic">
            <img
              className="lang-icon"
              src="https://investone-law.com/wp-content/uploads/2019/06/quoc-ky-viet-nam-768x512.jpg"
            />
          </div>
          <div className="col-1">
            <input
              type="radio"
              name="language"
              value="vi"
              onChange={this.onHandleChange}
              checked={language === "vi"}
            />
          </div>

          <div className="col-3">
            <img
              className="lang-icon"
              src="https://kenh14cdn.com/thumb_w/660/2017/5-1503128133747.png"
            />
          </div>
          <div className="col-1">
            <input
              type="radio"
              name="language"
              value="en"
              onChange={this.onHandleChange}
              checked={language === "en"}
            />
          </div>

          <div className="col-3">
            <img
              className="lang-icon"
              src="https://anbvietnam.vn/wp-content/uploads/2020/08/quoc-ky-cua-nhat-ban3.jpg"
            />
          </div>
          <div className="col-1">
            <input
              type="radio"
              name="language"
              value="japan"
              onChange={this.onHandleChange}
              checked={language === "japan"}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    setLanguageAct: (language) => {
      dispatch(setLanguage(language));
    },
  };
};

export default connect(null, mapDispatchToProps)(Language);
