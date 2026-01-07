import { PropsWithChildren } from "react";
import { appWindow } from "@tauri-apps/api/window";

type WidgetShellProps = PropsWithChildren<{
  title: string;
}>;

function WidgetShell({ title, children }: WidgetShellProps) {
  const handleDrag = () => {
    appWindow.startDragging().catch(() => {});
  };

  return (
    <div className="widget-shell">
      <div className="widget-header" onMouseDown={handleDrag}>
        <span className="widget-title">{title}</span>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}

export default WidgetShell;
