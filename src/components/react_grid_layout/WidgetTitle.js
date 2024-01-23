import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { FormattedSymbol } from "../../../components/Formating";
import { DragSource } from "react-dnd";
import { connect } from "react-redux";

import { CommonObject, DragTypes, screenMode } from "../../../utils";
import AutoSizer from "../../../components/AutoSizer";
import { Fragment } from "react";
import Timer from "../Footer/Timer";
import Footer from "../Footer/Footer";

class WidgetTitle extends Component {
  renderTitle = (titleId, isDisplaySymbol, currentSymbol, instrument) => {
    const { displayFooter } = this.props;
    return (
      <Fragment>
        <button className="widget-controls">
          <FormattedMessage id={titleId} />
          {isDisplaySymbol && <span> - </span>}
          {isDisplaySymbol && currentSymbol && instrument && (
            <span>
              <FormattedSymbol
                value={currentSymbol ? currentSymbol.id : ""}
                instrument={instrument}
              />
            </span>
          )}
        </button>
        {displayFooter && (
          <Footer type={screenMode.DESKTOP} displayOnWidgetTitle={true} />
        )}
      </Fragment>
    );
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.props.titleId !== nextProps.titleId ||
      this.props.connectDragSource !== nextProps.connectDragSource ||
      this.props.isAllowDragDrop !== nextProps.isAllowDragDrop ||
      this.props.isDisplaySymbol !== nextProps.isDisplaySymbol ||
      (this.props.isDisplaySymbol === true &&
        (this.props.currentSymbol !== nextProps.currentSymbol ||
          this.props.instrument !== nextProps.instrument))
    );
  }

  render() {
    const {
      titleId,
      connectDragSource,
      isAllowDragDrop,
      isDisplaySymbol,
      currentSymbol,
      instrument,
    } = this.props;
    return (
      <div className="col">

          {({ height, width }) => (
            <div className="widget-title" style={{ height, width }}>
              {isAllowDragDrop
                ? connectDragSource(
                    this.renderTitle(
                      titleId,
                      isDisplaySymbol,
                      currentSymbol,
                      instrument
                    )
                  )
                : this.renderTitle(titleId)}
            </div>
          )}
  
      </div>
    );
  }
}



function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

const DraggableWidgetTitle = DragSource(
  DragTypes.WIDGET,
  dragSource,
  collectDrag
)(WidgetTitle);

export default DraggableWidgetTitle;
