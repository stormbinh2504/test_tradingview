import React from "react";

const LiCreator = (text, link, liChildren) => {
  return (
    <li>
      <a href={link}>{text}</a>
      {liChildren}
    </li>
  );
};

const TestJsonMenu = ({ arrObjs, recLink }) => {
  let MenuItems = [];

  const UlParent = ({ UlChildren }) => {
    // thành phần này sẽ đơn giản tạo một phần tử ul với các phần tử con
    return <ul style={{ display: "flex" }}>{UlChildren}</ul>;
  };

  for (let i = 0; i < arrObjs.length; i++) {
    if (arrObjs[i].children) {
      // nếu mục có con
      let ulWithChildren = (
        <TestJsonMenu arrObjs={arrObjs[i].children} recLink={arrObjs[i].link} />
      ); // sau đó chúng tôi tạo một ul với các con, bằng cách tự gọi UlTreeBuilder

      let liSingle = LiCreator(
        arrObjs[i].text,
        arrObjs[i].link,
        ulWithChildren
      ); // sau đó chúng ta thêm ul đã tạo này vào một li mới
      MenuItems.push(<UlParent UlChildren={liSingle} />); // sau đó chúng ta đặt li này vào ul và đẩy ul vào mảng MenuItems của mức đệ quy hiện tại
    } else {
      // if the item has no children
      let liSingle = LiCreator(arrObjs[i].text, arrObjs[i].link); // chúng ta chỉ tạo một li mà không có con nào
      MenuItems.push(<UlParent UlChildren={liSingle} />); // sau đó chúng ta đặt li này vào ul và đẩy ul vào mảng MenuItems của mức đệ quy hiện tại
    }
  }
  console.log("MenuItems", MenuItems);

  return <div className="abc">{MenuItems}</div>;
};

export default TestJsonMenu;
