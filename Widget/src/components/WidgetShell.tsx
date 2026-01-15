import { PropsWithChildren, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

type WidgetShellProps = PropsWithChildren<{
  title: string;
}>;

function WidgetShell({ title, children }: WidgetShellProps) {
  const win = getCurrentWindow();

  useEffect(() => {
    console.log("WidgetShell mounted with title:", title);
    console.log("Current location:", window.location.href);
  }, [title]);

  const handleDrag = () => {
    win.startDragging().catch(() => {});
  };

  const handleClose = () => {
    win.close().catch(() => {});
  };

  const handleOpenDevtools = () => {
    console.log("Opening DevTools...");
    win.openDevtools().catch((err) => {
      console.error("Failed to open DevTools:", err);
    });
  };

  return (
    <div className="widget-shell">
      <div className="widget-header" onMouseDown={handleDrag}>
        <span className="widget-title">{title}</span>
        <div className="widget-header-actions">
          <button
            className="widget-devtools-btn"
            onClick={handleOpenDevtools}
            onMouseDown={(e) => e.stopPropagation()}
            title="Open DevTools"
          >
            Dev
          </button>
          <button
            className="widget-close-btn"
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
          >
            ×
          </button>
        </div>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}

export default WidgetShell;
