// src/main.jsx or index.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/Store.jsx";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import { Chatbot } from "./component/ChatBot.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <>
      <App />
      <Chatbot/>
      </>
    </PersistGate>
  </Provider>
);
