import { useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import DocEditModal from "./DocEditModal";
import { useRouter } from "expo-router";
import { UserDetailContext } from "../../context/UserDetailContext";

const DocList = ({ teacherId }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { userDetail } = useContext(UserDetailContext);

  const router = useRouter();

  useEffect(() => {
    fetchDocs();
  }, [teacherId]);

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

  const handleDelete = async (docId) => {
    if (window.confirm("Bạn có chắc muốn xoá tài liệu này không?")) {
      try {
        await deleteDoc(doc(db, "docs", docId));
        setDocs((prev) => prev.filter((doc) => doc.id !== docId));
      } catch (error) {
        alert("Xoá thất bại: " + error.message);
      }
    }
  };

  const handleEdit = (doc) => {
    setSelectedDoc(doc);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedDoc(null);
    setShowModal(true);
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div style={{ margin: 20 }}>
      <div>
        <h2 style={{ marginBottom: "5px" }}>
          Danh sách các tài liệu đã tải lên
        </h2>
        <p style={{ fontWeight: "bold", color: "#333" }}>
          Email giáo viên: {teacherId}
        </p>

        <button
          style={{
            ...addDocButton,
            backgroundColor: "#28a745",
          }}
          onClick={() => router.push("/addDocWithAI")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
        >
          ➕ Thêm tài liệu bằng AI
        </button>
        <button
          style={{
            ...addDocButton,
            backgroundColor: "#4287f5",
            marginLeft: 10,
          }}
          onClick={() => router.push("/addDocWithJSON")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#728bb3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#4287f5")}
        >
          ➕ Thêm tài liệu bằng JSON
        </button>
        <button
          style={{
            ...addDocButton,
            backgroundColor: "#d6a81c",
            marginLeft: 10,
          }}
          onClick={() => handleAddNew()}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#9fa132")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#d6a81c")}
        >
          ➕ Thêm tài liệu thủ công
        </button>
      </div>

      <div
        style={{
          overflowY: "auto",
          maxHeight: "calc(100dvh - 35dvh)",
          paddingBottom: "10px",
        }}
      >
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
                  {Array.isArray(doc.chapters) && doc.chapters.length > 0 ? (
                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                      {doc.chapters.map((chapter, index) => (
                        <li key={index} style={{ listStyleType: "decimal" }}>
                          {chapter.chapterName}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <i>Không có chương</i>
                  )}
                </td>
                <td style={thTdStyle}>{doc.quiz ? "✅ Có" : "❌ Không"}</td>
                <td style={thTdStyle}>
                  {doc.flashcards ? "✅ Có" : "❌ Không"}
                </td>
                <td style={thTdStyle}>
                  <button
                    onClick={() => handleEdit(doc)}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "6px",
                      marginBottom: 10,
                      padding: "5px 10px",
                      borderRadius: "4px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedDoc && (
        <DocEditModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          docData={selectedDoc}
          onSave={async (updatedData) => {
            const docRef = doc(db, "docs", selectedDoc.id);
            await updateDoc(docRef, updatedData);
          }}
        />
      )}

      {showModal && selectedDoc === null && (
        <DocEditModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          docData={selectedDoc}
          onSave={async (updatedData) => {
            await setDoc(doc(db, "docs", Date.now().toString()), {
              ...updatedData,
              createOn: new Date(),
              createBy: userDetail.email,
            });
            setShowModal(false);
          }}
        />
      )}
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
  padding: "10px",
  textAlign: "left",
  verticalAlign: "top",
};

const headerStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px",
  textAlign: "center",
  position: "sticky",
  zIndex: 1,
  top: 0,
};

const addDocButton = {
  marginBottom: "10px",
  padding: "10px",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
