import React from "react";

function Navbar() {
  const left = { fontSize: "1.3rem", fontWeight: 700 };
  const center = { fontWeight: 600 };
  const right = { display: "flex", alignItems: "center", gap: "16px" };

  const btn = {
    padding: "6px 14px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 600,
    color: "white",
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#003B73",
        padding: "10px 24px",
        color: "white",
        height: "80px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <div style={left}>Innofund</div>
      <a
        href="#about"
        style={{ ...center, color: "white", textDecoration: "none" }}
      >
        About
      </a>
      <div style={right}>
        <button style={{ ...btn, backgroundColor: "#0284C7" }}>
          Send Request
        </button>
        <button style={{ ...btn, backgroundColor: "#00A5CF" }}>Profile</button>
      </div>
    </nav>
  );
}

export default Navbar;
