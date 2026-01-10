import { PropsWithChildren } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

type WidgetShellProps = PropsWithChildren<{
  title: string;
}>;

function WidgetShell({ title, children }: WidgetShellProps) {
  const handleDrag = () => {
    getCurrentWindow()
      .startDragging()
      .catch(() => {});
  };

  const handleClose = () => {
    getCurrentWindow()
      .close()
      .catch(() => {});
  };

  return (
    <div className="widget-shell">
      <div className="widget-header" onMouseDown={handleDrag}>
        <span className="widget-title">{title}</span>
        <button
          className="widget-close-btn"
          onClick={handleClose}
          onMouseDown={(e) => e.stopPropagation()}
        >
          ×
        </button>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}

export default WidgetShell;
