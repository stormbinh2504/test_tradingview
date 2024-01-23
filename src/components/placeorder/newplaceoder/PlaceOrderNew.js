import React, { Component } from "react";
import "./placeordernew.scss";
import Select from "react-select";
import OrderActionSelectorGroup from "./OrderActionSelector/OrderActionSelectorGroup";
import SymbolSearchMini from "./SymbolSearchMini/SymbolSearchMini";
import OrderInput from "./OrderInput/OrderInput";
import OrderCapacity from "./OrderCapacity/OrderCapacity";
import CustomerAccountSelector from "./CustomerAccountSelector/CustomerAccountSelector";
import dataplaceorder from "./datajson/PlaceOrderJson.json";

class PlaceOrderNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      price: 0,
      code: "",
      floor_price: 0,
      ceil_price: 0,
      mid_price: 0,
      isActiveBuy: false,
      isActiveSell: false,
      isCheckPrice: false,
    };
  }

  quantityUp = (quantity) => {
    this.setState({
      quantity: quantity + 10,
    });
  };

  quantityDown = (quantity) => {
    if (this.state.quantity >= 10) {
      this.setState({
        quantity: quantity - 10,
      });
    }
  };

  priceUp = (price) => {
    this.setState({
      price: price + 1.5,
    });
  };

  handleIsCheckPrice = () => {
    this.setState({
      isCheckPrice: true,
    });
  };

  priceDown = (price) => {
    if (this.state.price >= 1.5) {
      this.setState({
        price: price - 1.5,
      });
    }
  };

  onHandleChange = (newcode) => {
    this.setState({ code: newcode });
  };

  onHandleChangeQuantity = (newquantity) => {
    this.setState({ quantity: newquantity });
  };

  onHandleChangePrice = (newprice) => {
    this.setState({ price: newprice });
  };

  changeActiveBuy = (isActiveBuy, isActiveSell) => {
    this.setState({
      ...this.state,
      isActiveBuy: isActiveBuy,
      isActiveSell: isActiveSell,
    });
  };

  changeActiveSell = (isActiveBuy, isActiveSell) => {
    this.setState({
      ...this.state,
      isActiveBuy: isActiveBuy,
      isActiveSell: isActiveSell,
    });
  };

  render() {
    const { quantity, price, code, isActiveSell, isActiveBuy } = this.state;
    return (
      <div className="place__order">
        <div className="place__order-widget">
          <div className="place__order-widget-header">
            <div className="row">
              <div className="col-12">
                <div className="widget-title">Đặt lệnh</div>
              </div>
            </div>
          </div>
          <div className="place__order-widget-body">
            <div className="widget-body-wrapper">
              <div className="row">
                <div className="col-12" style={{ marginBottom: "20px" }}>
                  <CustomerAccountSelector></CustomerAccountSelector>
                </div>

                <div className="col-12">
                  <OrderActionSelectorGroup
                    code={code}
                    isActiveBuy={isActiveBuy}
                    isActiveSell={isActiveSell}
                    changeActiveBuy={this.changeActiveBuy}
                    changeActiveSell={this.changeActiveSell}
                  ></OrderActionSelectorGroup>
                </div>

                <div className="col-12">
                  <SymbolSearchMini
                    code={code}
                    onHandleChange={this.onHandleChange}
                  ></SymbolSearchMini>
                </div>

                <div className="col-12">
                  <OrderInput
                    code={code}
                    quantity={quantity}
                    price={price}
                    quantityUp={this.quantityUp}
                    quantityDown={this.quantityDown}
                    priceUp={this.priceUp}
                    priceDown={this.priceDown}
                    handleIsCheckPrice={this.handleIsCheckPrice}
                    onHandleChangePrice={this.onHandleChangePrice}
                    onHandleChangeQuantity={this.onHandleChangeQuantity}
                  ></OrderInput>
                </div>

                <div class="col-12">
                  <OrderCapacity></OrderCapacity>
                </div>

                <div className="col-12">
                  <div className="action-container no-padding">
                    {isActiveBuy && isActiveBuy ? (
                      <button
                        className="btn-buy"
                        onClick={() => {
                          alert("Mua thành công");
                        }}
                      >
                        Mua {quantity} @ {price}
                      </button>
                    ) : isActiveSell && isActiveSell ? (
                      <button
                        className="btn-sell"
                        onClick={() => {
                          alert("Bán thành công");
                        }}
                      >
                        Bán {quantity} @ {price}
                      </button>
                    ) : (
                      <button className="btn-normal" disabled>
                        {quantity} @ {price}
                      </button>
                    )}
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

export default PlaceOrderNew;
