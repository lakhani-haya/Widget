import { useState, useEffect } from "react";

function DevRuntimeOverlay() {
  if (!import.meta.env.DEV) {
    return null;
  }

  const [error, setError] = useState<string>("");
  const [location, setLocation] = useState({
    href: window.location.href,
    hash: window.location.hash,
  });

  useEffect(() => {
    const updateLocation = () => {
      setLocation({
        href: window.location.href,
        hash: window.location.hash,
      });
    };

    const handleError = (event: ErrorEvent) => {
      const msg = `Error: ${event.message}\nFile: ${event.filename}:${event.lineno}:${event.colno}\nStack: ${event.error?.stack || "none"}`;
      setError(msg);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const msg = `Unhandled Promise Rejection: ${event.reason}`;
      setError(msg);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("hashchange", updateLocation);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("hashchange", updateLocation);
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleCopy = () => {
    const text = `URL: ${location.href}\nHash: ${location.hash}\nError: ${error || "none"}`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    background: "rgba(0, 0, 0, 0.95)",
    color: "#0f0",
    padding: "8px",
    fontSize: "11px",
    fontFamily: "monospace",
    zIndex: 999999,
    borderBottom: "2px solid #0f0",
    maxHeight: "50vh",
    overflow: "auto",
  };

  const buttonStyle: React.CSSProperties = {
    background: "#222",
    color: "#0f0",
    border: "1px solid #0f0",
    padding: "4px 8px",
    marginRight: "4px",
    cursor: "pointer",
    fontSize: "10px",
    fontFamily: "monospace",
  };

  const errorStyle: React.CSSProperties = {
    color: "#f00",
    marginTop: "8px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
  };

  return (
    <div style={overlayStyle}>
      <div>
        <strong>DEV RUNTIME OVERLAY</strong>
      </div>
      <div>URL: {location.href}</div>
      <div>Hash: {location.hash}</div>
      <div style={{ marginTop: "8px" }}>
        <button style={buttonStyle} onClick={handleReload}>
          Reload
        </button>
        <button style={buttonStyle} onClick={handleCopy}>
          Copy
        </button>
      </div>
      {error && (
        <div style={errorStyle}>
          <strong>ERROR:</strong>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}

export default DevRuntimeOverlay;
