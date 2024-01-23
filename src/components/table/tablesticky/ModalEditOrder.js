import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class ModalEditOrder extends Component {
  constructor(props) {
    super(props);
    const { id, name, email, location, phone, total_spend, total_orders } =
      this.props.data.values;

    this.state = {
      show: false,
      id,
      name,
      email,
      location,
      phone,
      total_spend,
      total_orders,
    };
  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  onChangeOrder = (e) => {
    let target = e.target;
    let value = target.value;
    let name = target.name;
    this.setState({
      [name]: value,
    });
    console.log(this.state);
  };

  onDeleteOrder = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
      //eslint-disable-line
      console.log("id", id);
    }
  };

  render() {
    const { id, name, email, location, phone, total_spend, total_orders } =
      this.state;
    return (
      <>
        <div className="action-col">
          <div onClick={this.handleShow}>
            <i class="bx bx-edit"></i>
          </div>
          <div onClick={() => this.onDeleteOrder(id)}>
            <i class="bx bx-x-circle"></i>
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Sửa thông tin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="content-add">
              <div className="input-add">
                <label htmlFor="email" className="input-label font-bold">
                  Name:
                </label>
                <input
                  type="text"
                  value={name}
                  name="name"
                  onChange={this.onChangeOrder}
                />
              </div>
              <div className="input-add">
                <label htmlFor="email" className="input-label font-bold">
                  Email:
                </label>
                <input
                  type="text"
                  value={email}
                  name="email"
                  onChange={this.onChangeOrder}
                />
              </div>
              <div className="input-add">
                <label htmlFor="email" className="input-label font-bold">
                  Location:
                </label>
                <input
                  type="text"
                  value={location}
                  name="location"
                  onChange={this.onChangeOrder}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Đóng
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ModalEditOrder;
