import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import ClockWidget from "../widgets/ClockWidget";
import NotesWidget from "../widgets/NotesWidget";

function HostScreen() {
  const [message, setMessage] = useState("");

  const handleOpenClock = async () => {
    console.log("Open Clock Widget clicked");
    const id = crypto.randomUUID();
    try {
      await invoke("open_widget_window", {
        params: {
          id,
          widget_type: "clock",
          x: 100,
          y: 100,
          width: 360,
          height: 220,
        },
      });
      setMessage("Clock widget opened");
    } catch (error) {
      console.error("Failed to open clock widget:", error);
      setMessage("Failed to open clock widget");
    }
    setTimeout(() => setMessage(""), 2000);
  };

  const handleOpenNotes = async () => {
    console.log("Open Notes Widget clicked");
    const id = crypto.randomUUID();
    try {
      await invoke("open_widget_window", {
        params: {
          id,
          widget_type: "notes",
          x: 500,
          y: 100,
          width: 400,
          height: 300,
        },
      });
      setMessage("Notes widget opened");
    } catch (error) {
      console.error("Failed to open notes widget:", error);
      setMessage("Failed to open notes widget");
    }
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
