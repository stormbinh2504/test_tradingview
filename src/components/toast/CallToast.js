import React, { Component } from "react";
import CreateToast from "./CreateToast";
import Button from "react-bootstrap/Button";

// const module_toast = [
//   {
//     type: "success",
//     title: "Success",
//     msg: "msg-success",
//   },
//   {
//     type: "info",
//     title: "info",
//     msg: "msg-info",
//   },
//   {
//     type: "warning",
//     title: "warning",
//     msg: "msg-warning",
//   },
// ];

class CallToast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeToast: "",
    };
  }

  InfoToast = (type, title, msg) => {
    return (
      <CreateToast
        typeToast={type}
        titleToast={title}
        msgToast={msg}
      ></CreateToast>
    );
  };

  render() {
    const { typeToast } = this.state;

    console.log("typeToast", typeToast);

    return (
      <>
        <div className="btn-show-toast">
          <Button
            variant="success"
            onClick={() => this.setState({ typeToast: "success" })}
          >
            Open Success
          </Button>
          <Button
            variant="info"
            onClick={() => this.setState({ typeToast: "info" })}
          >
            Open Info
          </Button>
          <Button
            variant="warning"
            onClick={() => this.setState({ typeToast: "warning" })}
          >
            Open Warning
          </Button>
        </div>
        <div>
          {typeToast && typeToast === "success"
            ? this.InfoToast("success", "success", "success")
            : typeToast === "info"
            ? this.InfoToast("info", "info", "info")
            : typeToast === "warning"
            ? this.InfoToast("warning", "warning", "warning")
            : ""}
        </div>
      </>
    );
  }
}

export default CallToast;
