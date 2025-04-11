import { useState } from "react";

const Header = ({ setView }) => {
  return (
    <div style={{ padding: 20 }}>
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
        onClick={() => setView("students")}
        style={{
          marginRight: "10px",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "white",
        }}
      >
        Danh sách học sinh
      </button>

      <button
        onClick={() => setView("teachers")}
        style={{ padding: "10px", backgroundColor: "#e0a22d", color: "white" }}
      >
        Danh sách giáo viên
      </button>
    </div>
  );
};

export default Header;
