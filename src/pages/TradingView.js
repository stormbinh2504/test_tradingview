import React, { Component } from "react";
import { TVChartContainer } from "./TVChartContainer";
import { connect } from "react-redux";

class TradingView extends Component {
  render() {
    const { language, theme } = this.props;

    return (
      <div>
        <TVChartContainer language={language} theme={theme}></TVChartContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.LanguageReducer.language,
    theme: state.ThemeReducer.mode,
  };
};
export default connect(mapStateToProps, null)(TradingView);
