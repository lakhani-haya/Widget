function DebugOverlay() {
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.8)",
        color: "#79c0ff",
        padding: "8px 12px",
        fontSize: "0.75rem",
        fontFamily: "monospace",
        zIndex: 9999,
        borderTop: "1px solid rgba(79, 192, 255, 0.3)",
      }}
    >
      Location: {window.location.href}
    </div>
  );
}

export default DebugOverlay;
