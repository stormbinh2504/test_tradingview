import React, { Component } from "react";
import dataplaceorder from "../datajson/PlaceOrderJson.json";

class CustomerAccountSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_custom: [],
      account_control: [],
    };
  }

  componentDidMount() {
    for (var key in dataplaceorder) {
      if (dataplaceorder[key].account) {
        this.setState({
          account_custom: [
            ...this.state.account_custom,
            dataplaceorder[key].account,
          ],
        });
      }
      if (dataplaceorder[key].account_control) {
        let concat = this.state.account_control.concat(
          dataplaceorder[key].account_control
        );

        this.setState({
          account_control: concat,
        });
      }
    }
  }

  // componentDidUpdate(prevState) {
  //   if (this.state.account_custom !== prevState.account_custom) {
  //   }
  // }

  render() {
    const { account_custom, account_control } = this.state;
    return (
      <div className="row">
        <div className="col-6">
          <div className="custom-form-group">
            <input
              type="text"
              class="custom-form-control "
              style={{ padding: "7px 5px" }}
              disabled=""
              value={account_custom[0]}
              disabled
            ></input>
          </div>
        </div>
        <div className="col-6">
          <div class="custom-form-group">
            <select class="custom-form-control">
              {account_control.map((item, index) => (
                <option value={item.account_value}>{item.account_value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerAccountSelector;
