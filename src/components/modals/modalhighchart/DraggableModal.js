import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { setToggleModal } from "../../../redux/actions/ModalAction";
import ChartMatchedInfo from "./ChartMatchedInfo";
import ChartMatchedInDay from "./ChartMatchedInDay";
import DraggableWrapper from "./DraggableWrapper";
import "./DraggableModal.css";

class DraggableModal extends Component {
  toggleSymbolDetailModal = () => {
    const { isToggleModal, setToggleModal } = this.props;
    setToggleModal(!isToggleModal);
  };

  render() {
    const { isToggleModal } = this.props;

    return (
      <div className="">
        <Button variant="secondary" onClick={this.toggleSymbolDetailModal}>
          Open Modal
        </Button>
        <DraggableWrapper dragClass=".dragHandler" wrapperClass="modal-content">
          <Modal
            show={isToggleModal}
            onHide={!isToggleModal}
            className="draggable-modal"
          >
            <Modal.Header
              closeButton={this.toggleSymbolDetailModal}
              className="dragHandler"
            >
              <Modal.Title>Thông tin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-6 symbol-detail-content">
                  <ChartMatchedInDay></ChartMatchedInDay>
                </div>
                <div className="col-6 symbol-detail-content">
                  <ChartMatchedInfo></ChartMatchedInfo>
                </div>
              </div>
              {/* <ChartMatchedInDay></ChartMatchedInDay> */}
              {/* <ChartMatchedInfo></ChartMatchedInfo> */}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={this.toggleSymbolDetailModal}
              >
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </DraggableWrapper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isToggleModal: state.ModalReducer.isToggleModal,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setToggleModal: (isToggleModal) => {
      dispatch(setToggleModal(isToggleModal));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableModal);
