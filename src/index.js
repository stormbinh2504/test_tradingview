import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "./assets/css/index.css";

// import "./assets/css/themetest.scss";

import IntlProviderWrapper from "./hoc/IntlProviderWrapper";
import Layout from "./components/layout/Layout";

import { applyMiddleware, createStore } from "redux";

import { Provider } from "react-redux";

import rootReducer from "./redux/reducers";

import thunk from "redux-thunk";

document.title = "Binhhuun";

const middleware = [thunk];

const store = createStore(rootReducer, applyMiddleware(...middleware));

ReactDOM.render(
  <Provider store={store}>
    <IntlProviderWrapper>
      <React.StrictMode>
        <Layout />
      </React.StrictMode>
    </IntlProviderWrapper>
  </Provider>,
  document.getElementById("root")
);

// if (window && !window.Intl) {
//   import("intl").then((Intl) => {
//     window.Intl = Intl;
//     renderApp();
//   });
// } else {
//   renderApp();
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
