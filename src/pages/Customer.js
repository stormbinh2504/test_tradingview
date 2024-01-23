import React, { Component } from "react";
import FamilyTree from "../components/FamilyTree";
import HighChart from "../components/highchart/HighChart";
import HighChartZoomable from "../components/highchart/HighChartZoomable";
import GroupMenu from "../components/menu/GroupMenu";
import Menu from "../components/menu/Menu";
import MenuTest from "../components/menu/MenuTest";
import ChartMatchedInDay from "../components/modals/modalhighchart/ChartMatchedInDay";
import DraggableModal from "../components/modals/modalhighchart/DraggableModal";
import DraggableWrapper from "../components/modals/modalhighchart/DraggableWrapper";
import TestJson from "../components/TestJson";
import TestJsonMenu from "../components/TestJsonMenu";
import TestJsonObj from "../components/TestJsonObj";
import CallToast from "../components/toast/CallToast";
import CreateToast from "../components/toast/CreateToast";

import binhData from "../data/jsonData.json";
import jsonobj from "../data/jsonDataObj.json";
import menus from "../data/TestData.json";
// let jsonData =
//   '{"menu":[{"text":"home","link":"https://google.com","children":[{"text":"Home-child","link":"https://google.com","children":[{"text":"home-child-child","link":"https://uottawa.ca","children":null},{"text":"home-child-chisdfsdf-2","link":"https://piano.uottawa.ca","children":null}]},{"text":"home-chi-2","link":"https://uottawa.ca","children":null},{"text":"home-chi 3","link":"https://uottawa.ca","children":null},{"text":"Home-child","link":"https://google.com","children":[{"text":"home-child-child","link":"https://uottawa.ca","children":null},{"text":"home-child-chi-2","link":"https://piano.uottawa.ca","children":null}]},{"text":"home-chi 3","link":"https://uottawa.ca","children":null}]},{"text":"page-1","link":"https://google.com","children":null},{"text":"contact","link":"https://google.com","children":null}]}';
// let jsObjUn = JSON.parse(jsonData);
// let jsObj = jsObjUn.menu;

class Customer extends Component {
  render() {
    console.log(jsonobj);
    return (
      <div>
        {/* <TestJson arrObjs={binhData.menu} recLink={""}></TestJson> */}
        {/* <TestJsonMenu arrObjs={binhData.menu} recLink={""}></TestJsonMenu> */}
        {/* <TestJsonObj arrObjs={jsonobj}></TestJsonObj> */}
        {/* <Menu></Menu> */}
        {/* <GroupMenu></GroupMenu> */}
        {/* <Menu menus={menus.menus}></Menu> */}
        {/* <MenuTest menus={binhData.menu}></MenuTest> */}
        {/* <FamilyTree></FamilyTree> */}
        {/* <HighChart></HighChart> */}
        {/* <HighChartZoomable></HighChartZoomable> */}
        <DraggableModal></DraggableModal>
        {/* <ChartMatchedInDay></ChartMatchedInDay> */}
        <CallToast></CallToast>
        {/* <CreateToast></CreateToast> */}
      </div>
    );
  }
}

export default Customer;
