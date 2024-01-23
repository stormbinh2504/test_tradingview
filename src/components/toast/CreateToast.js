import React, { Component } from "react";
import "./CreateToast.css";

class CreateToast extends Component {
  render() {
    const { typeToast, titleToast, msgToast } = this.props;

    return (
      <>
        <div>Binh</div>
        <div id="toast">
          <div className={`create-toast toast-${typeToast}`}>
            <div className="create-toast__icon">
              <i class="bx bxs-check-circle"></i>
            </div>
            <div className="create-toast__body">
              <h3 className="create-toast__title">{titleToast}</h3>
              <p className="create-toast_msg">{msgToast}</p>
            </div>
            <div className="btn btn-close-toast">
              <i class="bx bx-x"></i>
            </div>
          </div>

          {/* <div className="create-toast toast-info">
            <div className="create-toast__icon">
              <i class="bx bxs-check-circle"></i>
            </div>
            <div className="create-toast__body">
              <h3 className="create-toast__title">Success</h3>
              <p className="create-toast_msg">Hello anh em</p>
            </div>
            <div className="btn btn-close-toast">
              <i class="bx bx-x"></i>
            </div>
          </div>
          <div className="create-toast toast-warning">
            <div className="create-toast__icon">
              <i class="bx bxs-check-circle"></i>
            </div>
            <div className="create-toast__body">
              <h3 className="create-toast__title">Success</h3>
              <p className="create-toast_msg">Hello anh em</p>
            </div>
            <div className="btn btn-close-toast">
              <i class="bx bx-x"></i>
            </div>
          </div> */}
        </div>
      </>
    );
  }
}

export default CreateToast;
