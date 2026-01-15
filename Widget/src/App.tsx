import "./App.css";
import AppRouter from "./routes/AppRouter";
import DebugOverlay from "./components/DebugOverlay";

function App() {
  return (
    <>
      <AppRouter />
      <DebugOverlay />
    </>
  );
}

export default App;
