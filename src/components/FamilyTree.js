import React, { Component } from "react";

const recursiveData = {
  name: "Name1-1",
  partner: "Name1-2",
  birthDay: "01/02/1803",
  dob: "02/03/1874",
  childrens: [
    {
      name: "Name2-1",
      partner: "Name2-2",
      birthDay: "05/04/1823",
      dob: "06/05/1904",
      childrens: [
        {
          name: "Name3-1",
          partner: "Name3-2",
          birthDay: "19/07/1841",
          dob: "22/03/1924",
          childrens: [
            {
              name: "Name4-1",
              partner: "Name4-2",
              birthDay: "15/09/1873",
              dob: "21/06/1954",
            },
            {
              name: "Name4-3",
              partner: "Name4-4",
            },
          ],
        },
        {
          name: "Name3-2",
          partner: "3-4",
          birthDay: "01/02/1803",
          dob: "02/03/1874",
          childrens: [],
        },
      ],
    },
    {
      name: "Name2-3",
      partner: "Name2-4",
      birthDay: "01/02/1803",
      dob: "02/03/1874",
      childrens: [
        {
          name: "Name3-3",
          partner: "Name2",
          birthDay: "01/02/1803",
          dob: "02/03/1874",
          childrens: [],
        },
      ],
    },
  ],
};

class Member extends Component {
  render() {
    const { name } = this.props;
    const style = {
      width: "3rem",
      height: "3rem",
      background: "#c3c3c3",
      borderRadius: "50%",
    };
    return (
      <div className="card">
        <div style={style} />
        {name}
      </div>
    );
  }
}

class FamilyTree extends Component {
  render() {
    const personData = recursiveData;
    const style = {
      display: "block",
    };
    return (
      <div style={style} className="main-container">
        <Member name={personData.name} />
        {personData.childrens &&
          personData.childrens.map((person, index) => (
            <FamilyTree personData={person} />
          ))}
      </div>
    );
  }
}

export default FamilyTree;
