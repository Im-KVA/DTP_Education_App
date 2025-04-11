import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const AddDocToClassModal = ({ isOpen, onClose, classId, teacherEmail }) => {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "docs"));
        const teacherDocs = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((d) => d.createBy === teacherEmail);

        setDocs(teacherDocs);
      } catch (error) {
        console.error("🚨 Lỗi tải tài liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [isOpen, teacherEmail]);

  const handleAddDoc = async () => {
    if (!selectedDoc) {
      console.error("❌ Không có tài liệu nào được chọn!");
      return;
    }

    try {
      const classRef = doc(db, "classes", classId);
      const classSnap = await getDoc(classRef);

      if (!classSnap.exists()) {
        console.error("❌ Lớp không tồn tại!");
        return;
      }

      const classData = classSnap.data();
      const existingDocs = classData.docs || {};

      if (existingDocs[selectedDoc] && !confirmOverwrite) {
        const isConfirmed = window.confirm(
          "📢 Tài liệu đã tồn tại trong lớp học.\nBạn có muốn ghi đè lại tài liệu không?\n⚠ Ghi đè sẽ làm mới toàn bộ dữ liệu bảng điểm."
        );
        if (!isConfirmed) return;
        setConfirmOverwrite(true); // Cờ cho biết người dùng đã chấp nhận ghi đè
      }

      const students = classData.students || {};
      const studentIds = Object.keys(students);

      if (studentIds.length === 0) {
        console.warn("⚠ Lớp chưa có sinh viên!");
        return;
      }

      const studentData = {};
      for (const studentId of studentIds) {
        const studentRef = doc(db, "users", studentId);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          const studentInfo = studentSnap.data();
          const msv = studentInfo.msv || studentId;
          studentData[msv] = { completedChapters: [], quizScore: 0 };
        } else {
          console.warn(`⚠ Không tìm thấy thông tin sinh viên: ${studentId}`);
        }
      }

      await updateDoc(classRef, {
        [`docs.${selectedDoc}`]: studentData, // Ghi đè toàn bộ
      });

      console.log("🎉 Tài liệu đã được cập nhật thành công!");
      setConfirmOverwrite(false); // Reset lại cờ sau khi xử lý
      onClose();
    } catch (error) {
      console.error("❌ Lỗi thêm tài liệu:", error);
    }
  };

  const options = docs.map((doc) => ({
    value: doc.id,
    label: doc.Title,
  }));

  if (!isOpen) return null;

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h2>Thêm tài liệu vào lớp</h2>
        {loading ? (
          <p>Đang tải tài liệu...</p>
        ) : (
          <select
            style={{
              maxWidth: "100%",
              width: "100%",
            }}
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
          >
            <option value="">Chọn tài liệu</option>
            {docs.map((doc) => (
              <option key={doc.id} value={doc.id} title={doc.Title}>
                {doc.Title.length > 50
                  ? doc.Title.slice(0, 47) + "..."
                  : doc.Title}
              </option>
            ))}
          </select>
        )}
        <div style={{ marginTop: "10px" }}>
          <button onClick={handleAddDoc} disabled={!selectedDoc}>
            Thêm
          </button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocToClassModal;

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContent = {
  //position: "relative",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  width: "300px",
  textAlign: "center",
};
