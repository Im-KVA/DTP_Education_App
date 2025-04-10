import { useState } from "react";

const Header = ({ setView }) => {
  return (
    <div style={{ marginBottom: "20px", padding: 20 }}>
      <h1>Giao diện giáo viên</h1>
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
        style={{
          marginRight: "10px",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "white",
        }}
      >
        Danh sách tài liệu
      </button>

      <button
        onClick={() => setView("discuss")}
        style={{ padding: "10px", backgroundColor: "#e0a22d", color: "white" }}
      >
        Danh sách phòng thảo luận
      </button>
    </div>
  );
};

export default Header;
