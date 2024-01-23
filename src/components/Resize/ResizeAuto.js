import React, { Component, Fragment } from "react";
import ReactResizeDetector from "react-resize-detector";

class AutoSizer extends Component {
  render() {
    const { children, style, className, hideWhenZeroDimension } = this.props;
    return (
      <ReactResizeDetector handleWidth handleHeight>
        {({ width, height }) => {
          const childParams = { width: width || 0, height: height || 0 };
          if (width === 0 && height === 0 && hideWhenZeroDimension) {
            return <Fragment />;
          }
          return (
            <div
              className={className}
              style={{ width: 0, height: 0, overflow: "visible", ...style }}
            >
              {children(childParams)}
            </div>
          );
        }}
      </ReactResizeDetector>
    );
  }
}

export default AutoSizer;
