import React from "react";
import jsonobj from "../data/jsonDataObj.json";
import { useEffect } from "react";

const UlParent = ({ UlChildren }) => {
  return <ul>{UlChildren}</ul>;
};

const TestJsonObj = ({ arrObjs }) => {
  let MenuItems = [];

  // console.log("arrObjs", arrObjs);

  for (var key in arrObjs) {
    if (arrObjs[key].constructor === Object) {
      let ulWithChildren = <TestJsonObj arrObjs={arrObjs[key]}></TestJsonObj>;
      MenuItems.push(<UlParent UlChildren={ulWithChildren} />);
    } else {
      console.log(arrObjs[key]);
      MenuItems.push(<UlParent UlChildren={arrObjs[key]}></UlParent>);
    }
  }

  // if (arrObjs.account.constructor === Object) {
  //   var obj = arrObjs.account;
  //   for (var key in obj) {
  //     if (obj[key].constructor === Object) {
  //       var objbinh = obj[key];
  //       <TestJsonObj arrObjs={objbinh} recLink={""}></TestJsonObj>;
  //     } else if (obj[key].constructor === String) {
  //       MenuItems.push(<UlParent UlChildren={obj[key]}></UlParent>);
  //     } else return;
  //   }
  // }
  console.log(MenuItems);

  return MenuItems;
};

export default TestJsonObj;
