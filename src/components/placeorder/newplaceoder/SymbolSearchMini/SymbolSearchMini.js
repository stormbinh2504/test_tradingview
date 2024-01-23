import React, { Component } from "react";
import dataplaceorder from "../datajson/PlaceOrderJson.json";

const renderFloorTrade = (listcode) => {
  return listcode.map((item, index) => (
    <table>
      <tbody>
        <tr>
          <td>
            <span>HOSE</span>
          </td>
          <td className="text-ceil-price" id="toolTip-ceil-price">
            <span className="" style={{ color: "green" }}>
              {item.ceil_price}
            </span>
          </td>
          <td className="text-ref-price" id="toolTip-ref-price">
            <span className="" style={{ color: "orange" }}>
              {item.mid_price}
            </span>
          </td>
          <td className="text-floor-price" id="toolTip-floor-price">
            <span className="" style={{ color: "red" }}>
              {item.floor_price}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  ));
};

class SymbolSearchMini extends Component {
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

  onHandleChange = (e) => {
    let newcode = e.target.value;
    this.props.onHandleChange(newcode);
  };

  checkCode = (code) => {
    let codeItem = this.state.listcode.filter((item) => item.code === code);
    return renderFloorTrade(codeItem);
  };

  render() {
    const { code } = this.props;
    const { listcode } = this.state;

    return (
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

                    <datalist id="codes">
                      {listcode.map((item, index) => (
                        <option value={item.code}>{item.code}</option>
                      ))}
                    </datalist>
                    {this.checkCode(code)}

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
    );
  }
}

export default SymbolSearchMini;
