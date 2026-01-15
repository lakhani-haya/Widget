import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import DevRuntimeOverlay from "./components/DevRuntimeOverlay";

console.log("main.tsx loaded");
const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

const mountMarkerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  right: 0,
  background: "#000",
  color: "#0f0",
  padding: "4px 8px",
  fontSize: "10px",
  fontFamily: "monospace",
  zIndex: 999998,
  border: "1px solid #0f0",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <DevRuntimeOverlay />
      {import.meta.env.DEV && (
        <div style={mountMarkerStyle}>App mounted</div>
      )}
      <App />
    </HashRouter>
  </React.StrictMode>,
);
