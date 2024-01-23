import React, { Component } from "react";
// import "./placeorder.scss";
import Select from "react-select";

const renderFloorTrade = (ceil_price, mid_price, floor_price) => {
  let ref_price = (ceil_price + floor_price) / 2;
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <span>HOSE</span>
          </td>
          <td className="text-ceil-price" id="toolTip-ceil-price">
            <span className="" style={{ color: "green" }}>
              {ceil_price}
            </span>
          </td>
          <td className="text-ref-price" id="toolTip-ref-price">
            <span className="" style={{ color: "Orange" }}>
              {ref_price}
            </span>
          </td>
          <td className="text-floor-price" id="toolTip-floor-price">
            <span className="" style={{ color: "red" }}>
              {floor_price}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

class PlaceOrderNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      price: 0,
      code: "",
      floor_price: 5,
      ceil_price: 10,
      mid_price: 8,
      isActiveBuy: false,
      isActiveSell: false,
    };
  }

  quantityUp = () => {
    this.setState({
      quantity: this.state.quantity + 10,
    });
  };

  quantityDown = () => {
    if (this.state.quantity >= 10) {
      this.setState({
        quantity: this.state.quantity - 10,
      });
    }
  };

  priceUp = () => {
    this.setState({
      price: this.state.price + 1.5,
    });
  };

  priceDown = () => {
    if (this.state.price >= 1.5) {
      this.setState({
        price: this.state.price - 1.5,
      });
    }
  };

  checkPrice = (price, floor_price, ceil_price) => {
    if (price) {
      if (price <= floor_price || price >= ceil_price) {
        return (
          <div className="check-price" style={{ color: "red" }}>
            sai giá giao dịch
          </div>
        );
      }
    }
  };

  onHandleChange = (e) => {
    var target = e.target;
    var name = target.name;
    // var value = target.value;
    var value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };

  payValuePrice = (code) => {
    if (code) {
      if (code === "AAA") {
        return renderFloorTrade(
          this.state.ceil_price,
          this.state.mid_price,
          this.state.floor_price
        );
      } else if (code === "BBB") {
        return renderFloorTrade(
          this.state.ceil_price + 1.5,
          this.state.mid_price + 1,
          this.state.floor_price + 1
        );
      }
    }
  };

  changeActiveBuy = () => {
    this.setState({
      ...this.state,
      isActiveBuy: true,
      isActiveSell: false,
    });
  };

  changeActiveSell = () => {
    this.setState({
      ...this.state,
      isActiveBuy: false,
      isActiveSell: true,
    });
  };

  render() {
    const {
      quantity,
      price,
      code,
      floor_price,
      ceil_price,
      mid_price,
      isActiveSell,
      isActiveBuy,
    } = this.state;

    console.log("isActiveSell", isActiveSell);
    console.log("isActiveBuy", isActiveBuy);
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
                  <div className="row">
                    <div className="col-6">
                      <div className="custom-form-group">
                        <input
                          type="text"
                          class="custom-form-control "
                          style={{ padding: "7px 5px" }}
                          disabled=""
                          value="029C000279"
                        ></input>
                      </div>
                    </div>
                    <div className="col-6">
                      <div class="custom-form-group">
                        <select class="custom-form-control">
                          <option value="0001000272">029C000279.NM</option>
                          <option value="0001000352">029C000279.MG</option>
                          <option value="0001000273">029C000279.MG</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="buy-sell-tab-bar">
                    <button
                      className={
                        this.state.isActiveBuy
                          ? "buy-tab-item btn-action active"
                          : "buy-tab-item btn-action"
                      }
                      onClick={() => this.changeActiveBuy()}
                    >
                      <span className="label">Mua</span>
                      <span className="value">
                        <p className="">16.85</p>
                      </span>
                    </button>
                    <button
                      className={
                        this.state.isActiveSell
                          ? "sell-tab-item btn-action active"
                          : "sell-tab-item btn-action"
                      }
                      onClick={() => this.changeActiveSell()}
                    >
                      <span className="label">Bán</span>
                      <span className="value">
                        <p className="">16.90</p>
                      </span>
                    </button>
                    <div className="diff">
                      <span className="">50</span>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="symbol-search-mini-container">
                    <div className="row no-gutters align-items-center search-container">
                      <div className="custom-form-group select-symbol-content col-12">
                        <div className="symbol-select-input-suggest">
                          <div className=" row  no-gutters col-12 suggest-input-container">
                            <div className="col-12 suggest-input-container-label">
                              <div className="custom-form-group"></div>
                            </div>
                            <div className="custom-form-group col-12">
                              <div className="react-autosuggest__container">
                                <input
                                  type="text"
                                  className="react-autosuggest__input"
                                  placeholder="Chọn mã CK"
                                  list="codes"
                                  name="code"
                                  value={code}
                                  onChange={this.onHandleChange}
                                />
                                {this.payValuePrice(code)}
                                <datalist id="codes">
                                  <option>AAA</option>
                                  <option>BBB</option>
                                  <option>CCC</option>
                                  <option>DDD</option>
                                </datalist>

                                <div
                                  id="react-autowhatever-symbol-search-mini"
                                  role="listbox"
                                  className="react-autosuggest__suggestions-container"
                                ></div>
                                <button className="icon-drop-down">
                                  <i class="bx bxs-down-arrow"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 additional-information-container"></div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div class="row order-input">
                    <div class="col-6">
                      <div
                        class="custom-form-group qtty-wrapper"
                        id="qtty-wrapper"
                      >
                        <div
                          class="custom-form-group qtty-wrapper"
                          id="qtty-wrapper"
                        >
                          <div class="qtty-title">
                            <span>KL:</span>
                          </div>
                          <div class="qtty-input-suggest">
                            <div class="rc-input-number">
                              <div class="rc-input-number-handler-wrap">
                                <span class="rc-input-number-handler rc-input-number-handler-up ">
                                  <button
                                    class="rc-input-number-handler-up-inner"
                                    onClick={this.quantityUp}
                                  >
                                    <i class="bx bxs-up-arrow"></i>
                                  </button>
                                </span>
                                <span class="rc-input-number-handler rc-input-number-handler-down ">
                                  <button
                                    class="rc-input-number-handler-down-inner"
                                    onClick={this.quantityDown}
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
                                  onChange={this.onHandleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div
                        class="custom-form-group qtty-wrapper"
                        id="qtty-wrapper"
                      >
                        <div
                          class="custom-form-group qtty-wrapper"
                          id="qtty-wrapper"
                        >
                          <div class="qtty-title">
                            <span>Giá:</span>
                          </div>
                          <div class="qtty-input-suggest">
                            <div class="rc-input-number">
                              <div class="rc-input-number-handler-wrap">
                                <button
                                  class="rc-input-number-handler rc-input-number-handler-up "
                                  onClick={this.priceUp}
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
                                  onClick={this.priceDown}
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
                                />

                                {this.checkPrice(
                                  price,
                                  floor_price,
                                  ceil_price
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="capacity-container">
                    <div class="capacity">
                      <span class="label">Tiền mặt có thể mua:&nbsp;</span>
                      <span>
                        <span>7,617,032,239</span>
                      </span>
                    </div>
                    <div class="capacity">
                      <span class="label">Sức mua:&nbsp;</span>
                      <span>
                        <span>7,617,031,105</span>
                      </span>
                    </div>
                    <div class="capacity">
                      <span class="label">KL mua tối đa:&nbsp;</span>
                      <span>45,432,756</span>
                    </div>
                    <div class="capacity">
                      <span class="label">Tỉ lệ vay:&nbsp;</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="action-container no-padding">
                    {isActiveBuy && isActiveBuy ? (
                      <button className="btn-buy">
                        Mua {quantity} @ {price}
                      </button>
                    ) : isActiveSell && isActiveSell ? (
                      <button className="btn-sell">
                        Bán {quantity} @ {price}
                      </button>
                    ) : (
                      <button className="btn-normal">
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
