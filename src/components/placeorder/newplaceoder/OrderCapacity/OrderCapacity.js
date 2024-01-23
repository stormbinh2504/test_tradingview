import React, { Component } from "react";

class OrderCapacity extends Component {
  render() {
    return (
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
    );
  }
}

export default OrderCapacity;
