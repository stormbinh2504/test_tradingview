import React, { Component } from "react";
import dataplaceorder from "../datajson/PlaceOrderJson.json";

class OrderActionSelectorGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listcode: [],
    };
  }

  componentDidMount() {
    let concat = this.state.listcode.concat(dataplaceorder.place_oder);
    this.setState({
      listcode: concat,
    });
  }

  changeActiveBuy = (isActiveBuy, isActiveSell) => {
    this.props.changeActiveBuy((isActiveBuy = true), (isActiveSell = false));
  };

  changeActiveSell = (isActiveBuy, isActiveSell) => {
    this.props.changeActiveSell((isActiveBuy = false), (isActiveSell = true));
  };

  checkCode = (code) => {
    const { isActiveBuy, isActiveSell } = this.props;
    let codeItem = this.state.listcode.filter((item) => item.code === code);
    // return <div>abc</div>;
    return codeItem.map((item, index) => {
      return isActiveBuy ? (
        <span className="value">
          <p className="">{item.price_buy}</p>
        </span>
      ) : (
        <span className="value">
          <p className="">16.90</p>
        </span>
      );
    });
  };

  render() {
    const { isActiveBuy, isActiveSell, code } = this.props;
    return (
      <div className="buy-sell-tab-bar">
        <button
          className={
            isActiveBuy
              ? "buy-tab-item btn-action active"
              : "buy-tab-item btn-action"
          }
          onClick={() => this.changeActiveBuy(isActiveBuy, isActiveSell)}
        >
          <span className="label">Mua</span>
          {this.checkCode(code)}
          {/* <span className="value">
            <p className="">16.85</p>
          </span> */}
        </button>
        <button
          className={
            isActiveSell
              ? "sell-tab-item btn-action active"
              : "sell-tab-item btn-action"
          }
          onClick={() => this.changeActiveSell(isActiveBuy, isActiveSell)}
        >
          <span className="label">Bán</span>
          {/* <span className="value">
            <p className="">16.90</p>
          </span> */}
        </button>
        <div className="diff">
          <span className="">50</span>
        </div>
      </div>
    );
  }
}

export default OrderActionSelectorGroup;
