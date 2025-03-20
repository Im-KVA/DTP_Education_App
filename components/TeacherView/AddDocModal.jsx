import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const AddDocModal = ({ isOpen, onClose, classId, teacherEmail }) => {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [loading, setLoading] = useState(true);

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

    console.log(`📂 Đang thêm tài liệu: ${selectedDoc} vào lớp ${classId}`);

    try {
      const classRef = doc(db, "classes", classId);
      const classSnap = await getDoc(classRef);

      if (!classSnap.exists()) {
        console.error("❌ Lớp không tồn tại!");
        return;
      }

      const classData = classSnap.data();
      console.log("🎓 Dữ liệu lớp:", classData);

      const students = classData.students || {};
      const studentIds = Object.keys(students);

      if (studentIds.length === 0) {
        console.warn("⚠ Lớp chưa có sinh viên!");
        return;
      }

      console.log("👩‍🎓 Danh sách sinh viên:", studentIds);

      // 🔍 Lấy mã sinh viên từ Firestore
      const studentData = {};
      for (const studentId of studentIds) {
        const studentRef = doc(db, "users", studentId);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          const studentInfo = studentSnap.data();
          const msv = studentInfo.msv || studentId; // Nếu không có msv, dùng studentId
          studentData[msv] = { completedChapters: [], quizScore: 0 }; // Dữ liệu mặc định
        } else {
          console.warn(
            `⚠ Không tìm thấy thông tin của sinh viên: ${studentId}`
          );
        }
      }

      console.log("📝 Dữ liệu sinh viên mới:", studentData);

      // 📌 Kiểm tra nếu tài liệu đã có trong `docs`
      const existingDocs = classData.docs || {};
      const existingDocData = existingDocs[selectedDoc] || {}; // Dữ liệu sinh viên đã có trong docs[selectedDoc]

      console.log("📌 Dữ liệu tài liệu trước khi cập nhật:", existingDocData);

      // 🛠 Merge dữ liệu, giữ lại sinh viên cũ, chỉ thêm sinh viên mới
      const updatedDocData = { ...existingDocData };

      for (const msv in studentData) {
        if (!(msv in updatedDocData)) {
          // Chỉ thêm nếu chưa tồn tại
          updatedDocData[msv] = studentData[msv];
        }
      }

      console.log("✅ Dữ liệu tài liệu sau khi cập nhật:", updatedDocData);

      await updateDoc(classRef, {
        [`docs.${selectedDoc}`]: updatedDocData,
      });

      console.log("🎉 Tài liệu đã được cập nhật thành công!");

      onClose();
    } catch (error) {
      console.error("❌ Lỗi thêm tài liệu:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h2>Thêm tài liệu vào lớp</h2>
        {loading ? (
          <p>Đang tải tài liệu...</p>
        ) : (
          <select
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
          >
            <option value="">Chọn tài liệu</option>
            {docs.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.Title}
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

export default AddDocModal;

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
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  width: "300px",
  textAlign: "center",
};
