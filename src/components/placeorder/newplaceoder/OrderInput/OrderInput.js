import React, { Component } from "react";
import dataplaceorder from "../datajson/PlaceOrderJson.json";

class OrderInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listplaceorder: [],
    };
  }

  componentDidMount() {
    let concat = this.state.listplaceorder.concat(dataplaceorder.place_oder);
    this.setState({
      listplaceorder: concat,
    });
  }

  quantityUp = (quantity) => {
    this.props.quantityUp(quantity);
  };

  quantityDown = (quantity) => {
    this.props.quantityDown(quantity);
  };

  priceUp = (price) => {
    this.props.priceUp(price);
  };

  priceDown = (price) => {
    this.props.priceDown(price);
  };

  onHandleChangeQuantity = (e) => {
    let newquantity = e.target.value;
    this.props.onHandleChangeQuantity(newquantity);
  };

  onHandleChangePrice = (e) => {
    let newprice = e.target.value;
    this.props.onHandleChangePrice(newprice);
  };

  checkPrice = (price, floor_price, ceil_price) => {
    if (price) {
      if (price <= floor_price || price >= ceil_price) {
        // this.props.handleIsCheckPrice();
        return (
          <div className="check-price" style={{ color: "red" }}>
            sai giá giao dịch
          </div>
        );
      }
    }
  };

  render() {
    const { quantity, price, floor_price, ceil_price } = this.props;

    return (
      <div class="row order-input">
        <div class="col-6">
          <div class="custom-form-group qtty-wrapper" id="qtty-wrapper">
            <div class="custom-form-group qtty-wrapper" id="qtty-wrapper">
              <div class="qtty-title">
                <span>KL:</span>
              </div>
              <div class="qtty-input-suggest">
                <div class="rc-input-number">
                  <div class="rc-input-number-handler-wrap">
                    <span class="rc-input-number-handler rc-input-number-handler-up ">
                      <button
                        class="rc-input-number-handler-up-inner"
                        onClick={() => this.quantityUp(quantity)}
                      >
                        <i class="bx bxs-up-arrow"></i>
                      </button>
                    </span>
                    <span class="rc-input-number-handler rc-input-number-handler-down ">
                      <button
                        class="rc-input-number-handler-down-inner"
                        onClick={() => this.quantityDown(quantity)}
                      >
                        <i class="bx bxs-down-arrow"></i>
                      </button>
                    </span>
                  </div>
                  <div class="rc-input-number-input-wrap">
                    <input
                      type="text"
                      class="rc-input-number-input"
                      name="quantity"
                      value={quantity}
                      onChange={this.onHandleChangeQuantity}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="custom-form-group qtty-wrapper" id="qtty-wrapper">
            <div class="custom-form-group qtty-wrapper" id="qtty-wrapper">
              <div class="qtty-title">
                <span>Giá:</span>
              </div>
              <div class="qtty-input-suggest">
                <div class="rc-input-number">
                  <div class="rc-input-number-handler-wrap">
                    <button
                      class="rc-input-number-handler rc-input-number-handler-up "
                      onClick={() => this.priceUp(price)}
                    >
                      <span
                        unselectable="unselectable"
                        class="rc-input-number-handler-up-inner"
                      >
                        <i class="bx bxs-up-arrow"></i>
                      </span>
                    </button>
                    <button
                      class="rc-input-number-handler rc-input-number-handler-down "
                      onClick={() => this.priceDown(price)}
                    >
                      <span
                        unselectable="unselectable"
                        class="rc-input-number-handler-down-inner"
                      >
                        <i class="bx bxs-down-arrow"></i>
                      </span>
                    </button>
                  </div>
                  <div class="rc-input-number-input-wrap">
                    <input
                      type="text"
                      class="rc-input-number-input"
                      name="price"
                      value={price}
                      onChange={this.onHandleChangePrice}
                      list="price"
                    />

                    <datalist id="price">
                      <option>AOT</option>
                      <option>BDA</option>
                      <option>ADD</option>
                      <option>DEW</option>
                    </datalist>

                    {this.checkPrice(price, floor_price, ceil_price)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderInput;
