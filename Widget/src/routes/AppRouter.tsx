import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ClockWidget from "../widgets/ClockWidget";
import NotesWidget from "../widgets/NotesWidget";

function HostScreen() {
  const [message, setMessage] = useState("");

  const handleOpenClock = () => {
    console.log("Open Clock Widget clicked");
    setMessage("Clock widget action triggered");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleOpenNotes = () => {
    console.log("Open Notes Widget clicked");
    setMessage("Notes widget action triggered");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="app-shell">
      <h1 className="title">Widget Host</h1>
      <div className="button-group">
        <button className="widget-button" onClick={handleOpenClock}>
          Open Clock Widget
        </button>
        <button className="widget-button" onClick={handleOpenNotes}>
          Open Notes Widget
        </button>
      </div>
      {message && <p className="confirmation-message">{message}</p>}
    </div>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HostScreen />} />
      <Route path="/widget/clock" element={<ClockWidget />} />
      <Route path="/widget/notes" element={<NotesWidget />} />
    </Routes>
  );
}

export default AppRouter;
