import React, { useState, useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";

export default function AddDocWithJSON() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const handleUpload = async () => {
    setLoading(true);
    try {
      const cleanJson = userInput.trim();
      const resp = JSON.parse(cleanJson);

      if (!resp || !resp.docs || !Array.isArray(resp.docs)) {
        throw new Error(
          "JSON không hợp lệ: thiếu field 'docs' hoặc không phải mảng"
        );
      }

      const docs = resp.docs;

      if (!userDetail?.email) {
        throw new Error("Email người dùng không tồn tại! Hủy lưu dữ liệu.");
      }

      for (const docData of docs) {
        await setDoc(doc(db, "docs", Date.now().toString()), {
          ...docData,
          createOn: new Date(),
          createBy: userDetail.email,
        });
        console.log("Đã lưu vào Firebase:", docData);
      }

      alert("Đã lưu thành công!");
      router.push("../webView/teacherView");
    } catch (err) {
      console.error("Lỗi khi lưu dữ liệu:", err);
      alert("Lỗi khi xử lý JSON hoặc lưu dữ liệu: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 10 }}>📄 Tải tài liệu từ JSON</h2>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        rows={15}
        style={{
          width: "100%",
          padding: 10,
          fontFamily: "monospace",
          border: "1px solid #ccc",
          borderRadius: 8,
          resize: "vertical",
        }}
        placeholder='Dán JSON vào đây. Ví dụ: {"docs": [{...}, {...}]}'
      />
      <button
        disabled={loading}
        onClick={handleUpload}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        {loading ? "Đang tải..." : "📤 Tải tài liệu"}
      </button>
    </div>
  );
}
