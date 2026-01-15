import { useEffect } from "react";
import WidgetShell from "../components/WidgetShell";

function NotesWidget() {
  useEffect(() => {
    console.log("NotesWidget component mounted");
  }, []);

  const testStyle: React.CSSProperties = {
    background: "#1a1a1a",
    color: "#00ff00",
    padding: "20px",
    fontSize: "16px",
    fontFamily: "monospace",
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #00ff00",
  };

  return (
    <WidgetShell title="Notes">
      <div style={testStyle}>
        NotesWidget rendered
      </div>
    </WidgetShell>
  );
}

export default NotesWidget;
