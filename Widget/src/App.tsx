import "./App.css";

import { Route, Routes } from "react-router-dom";

function Shell() {
  return (
    <div className="app-shell">
      <h1 className="title">Widget Host</h1>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell />} />
    </Routes>
  );
}

export default App;
