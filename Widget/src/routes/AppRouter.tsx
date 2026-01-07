import { Route, Routes } from "react-router-dom";
import ClockWidget from "../widgets/ClockWidget";
import NotesWidget from "../widgets/NotesWidget";

function HostScreen() {
  return (
    <div className="app-shell">
      <h1 className="title">Widget Host</h1>
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
