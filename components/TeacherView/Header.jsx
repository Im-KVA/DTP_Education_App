import { useState } from "react";

const Header = ({ setView }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <button
        onClick={() => setView("classes")}
        style={{
          marginRight: "10px",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
        }}
      >
        Danh sách lớp
      </button>
      <button
        onClick={() => setView("docs")}
        style={{ padding: "10px", backgroundColor: "#28a745", color: "white" }}
      >
        Danh sách tài liệu
      </button>
    </div>
  );
};

export default Header;
