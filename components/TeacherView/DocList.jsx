import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const DocList = ({ teacherId }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "docs"));
        const docData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((d) => d.createBy === teacherId);
        setDocs(docData);
      } catch (error) {
        console.error("Lỗi tải danh sách tài liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [teacherId]);

  if (loading) return <p>Đang tải...</p>;
  if (docs.length === 0) return <p>Không có tài liệu nào.</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "5px" }}>Giao diện giáo viên</h2>
      <p style={{ fontWeight: "bold", color: "#333" }}>{teacherId}</p>{" "}
      {/* Đổi sang teacherId */}
      <button
        style={{
          marginBottom: "10px",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => console.log("Thêm tài liệu")}
      >
        Thêm tài liệu
      </button>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>Tiêu đề</th>
            <th style={headerStyle}>Số chương</th>
            <th style={headerStyle}>Bài kiểm tra</th>
            <th style={headerStyle}>Flashcards</th>
            <th style={headerStyle}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id}>
              <td style={thTdStyle}>{doc.Title}</td>
              <td style={thTdStyle}>
                {doc.chapters && Array.isArray(doc.chapters) ? (
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    {doc.chapters.map((chapter, index) => (
                      <li key={index} style={{ listStyleType: "decimal" }}>
                        {chapter.chapterName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "N/A"
                )}
              </td>
              <td style={thTdStyle}>{doc.quiz ? "Có" : "Không"}</td>
              <td style={thTdStyle}>{doc.flashcards ? "Có" : "Không"}</td>
              <td style={thTdStyle}>
                <button
                  style={{ marginRight: "5px" }}
                  onClick={() => console.log("Chỉnh sửa tài liệu:", doc.id)}
                >
                  Chỉnh sửa
                </button>
                <button onClick={() => console.log("Xóa tài liệu:", doc.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocList;

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const thTdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const headerStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px",
  textAlign: "center",
};
