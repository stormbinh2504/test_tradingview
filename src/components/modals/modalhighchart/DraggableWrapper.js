import React, { Component } from "react";

import Draggable from "react-draggable";

import "./DraggableWrapper.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class DraggableWrapper extends Component {
  state = {
    position: {
      x: 0,
      y: 0,
    },
  };

  resetPosition = () => {
    this.setState({
      position: {
        x: 0,
        y: 0,
      },
    });
  };

  onStart = () => {
    const { wrapperClass } = this.props;

    this.firstX = this.state.position.x;
    this.firstY = this.state.position.y;

    let elements = document.getElementsByClassName(wrapperClass),
      element = elements && elements.length > 0 ? elements[0] : null;
    const contentPos = element ? element.getBoundingClientRect() : {};

    this.firstPosLeft = contentPos.left;
    this.firstPosTop = contentPos.top;
    this.contentPos = contentPos;

    this.newPosition = this.state.position;

    this.scrollY = window.scrollY;
  };

  onStop = (event, data) => {
    // Viewport (wrapper)
    // Không có thay đổi về vị trí ===> Không xử lý bound
    console.log("data", data);
    if (data.y === this.firstY && data.x === this.firstX) {
      this.setState({
        position: {
          ...this.state.position,
          y: data.y,
          x: data.x,
        },
      });
      return;
    }
    const documentElement = document.documentElement;
    const wrapperHeight = Math.max(
      window.innerHeight || 0,
      documentElement.clientHeight
    );
    const wrapperWidth = Math.max(
      window.innerWidth || 0,
      documentElement.clientWidth
    );

    const contentPos = this.contentPos;

    let newPosition = {
      x: this.state.position.x,
      y: this.state.position.y,
    };

    if (data.x + (this.firstPosLeft - this.firstX) < 1) {
      newPosition.x = -(this.firstPosLeft - this.firstX);
    } else if (
      data.x + (this.firstPosLeft - this.firstX) + contentPos.width >
      wrapperWidth
    ) {
      newPosition.x =
        wrapperWidth - contentPos.width - (this.firstPosLeft - this.firstX);
    } else {
      newPosition.x = data.x;
    }

    if (data.y + (this.firstPosTop - this.firstY) < 1) {
      newPosition.y = -(this.firstPosTop - this.firstY);
    } else if (
      data.y + (this.firstPosTop - this.firstY) + contentPos.height >
      wrapperHeight
    ) {
      newPosition.y =
        wrapperHeight - contentPos.height - (this.firstPosTop - this.firstY);
    } else {
      newPosition.y = data.y;
    }

    this.newPosition = newPosition;
    this.setState({
      position: {
        ...this.state.position,
        ...this.newPosition,
      },
    });
  };

  render() {
    const dragHandlers = {
      onStart: this.onStart,
      onStop: (event, data) => this.onStop(event, data),
    };
    const { dragClass } = this.props;
    console.log("dragClass", dragClass);
    return (
      <Draggable
        handle={dragClass}
        position={this.state.position}
        {...dragHandlers}
      >
        {this.props.children}
      </Draggable>
    );
  }
}

export default DraggableWrapper;
