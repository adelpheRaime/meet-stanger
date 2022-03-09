/*!
 * Meet Stranger
 * Copyright(c) 2022-2023 Adelphe RAMIANDRISOA
 * MIT Licensed
 */
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Providers } from "from-react-context";
import store from "./store";

ReactDOM.render(
  <Providers context={store}>
    <App />
  </Providers>,
  document.getElementById("root")
);
