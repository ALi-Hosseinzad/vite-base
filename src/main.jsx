import React from "react";
import { ConfigProvider } from "antd";
import "antd/dist/antd.css";
import fa from "antd/es/locale/fa_IR";
import "assets/styles/Global.scss";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "store/store";
import "assets/styles/Fonts.css";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <ConfigProvider locale={fa} direction="rtl">
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
);

reportWebVitals();
