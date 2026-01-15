import { useEffect } from "react";
import WidgetShell from "../components/WidgetShell";

function ClockWidget() {
  useEffect(() => {
    console.log("ClockWidget component mounted");
  }, []);

  return (
    <WidgetShell title="Clock">
      <div className="widget-content">
        {import.meta.env.DEV && (
          <p style={{ color: "white", margin: "0 0 8px 0", fontSize: "0.8rem" }}>
            ClockWidget mounted
          </p>
        )}
        <h2>Clock Widget</h2>
      </div>
    </WidgetShell>
  );
}

export default ClockWidget;
