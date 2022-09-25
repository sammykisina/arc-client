import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./index.css";
import Layout from "./Layout";
import "regenerator-runtime/runtime";
import { ThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <React.StrictMode>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </React.StrictMode>
  </RecoilRoot>
);
