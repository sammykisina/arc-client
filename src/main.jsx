import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./index.css";
import Layout from "./Layout";
import "regenerator-runtime/runtime";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <React.StrictMode>
      <Layout />
    </React.StrictMode>
  </RecoilRoot>
);
