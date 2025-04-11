import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AddDocToClassModal from "./AddDocToClassModal";
import ClassViewModal from "./ClassViewModal";

const ClassList = ({ teacherId, teacherEmail }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassData, setSelectedClassData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "classes"),
      (querySnapshot) => {
        const classData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((c) => c.classTeacherId === teacherId);

        setClasses(classData);
        setLoading(false);
      },
      (error) => {
        console.error("Lỗi theo dõi lớp học:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [teacherId]);

  const openModal = (classId) => {
    setSelectedClass(classId);
    setIsModalOpen(true);
  };

  const viewClass = (cls) => {
    setSelectedClassData(cls);
    setIsViewModalOpen(true);
  };

  const exportClassScoreToExcel = async (cls) => {
    try {
      console.log("Exporting class:", cls.className);
      const docMap = cls.docs || {};
      const docIds = Object.keys(docMap);

      const docTitles = {};
      for (const docId of docIds) {
        const docSnap = await getDoc(doc(db, "docs", docId));
        if (docSnap.exists()) {
          docTitles[docId] = docSnap.data().Title || "Không tên";
        }
      }

      const studentsMap = cls.students || {};
      const studentEmails = Object.keys(studentsMap);
      const rows = [];

      for (const email of studentEmails) {
        const userSnap = await getDoc(doc(db, "users", email));
        if (!userSnap.exists()) continue;

        const student = userSnap.data();
        const msv = student.msv || "";
        const name = student.name || "";

        const row = {
          "Họ và tên": name,
          "Mã SV": msv,
        };

        for (const docId of docIds) {
          const docData = cls.docs[docId];
          const quizResults = docData[msv]?.allQuizResult || [];

          const bestScore =
            quizResults.length > 0
              ? Math.max(...quizResults.map((q) => q.quizScore || 0))
              : "";

          const title = docTitles[docId] || docId;
          row[title] = bestScore;
        }

        rows.push(row);
      }

      console.log("Rows to export:", rows);

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bảng điểm");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, `BangDiem_${cls.className}.xlsx`);
      console.log("Excel file should have been downloaded!");
    } catch (error) {
      console.error("Lỗi khi export file Excel:", error);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (classes.length === 0) return <p>Không có lớp học nào.</p>;

  return (
    <div style={{ margin: 20 }}>
      <h2 style={{ marginBottom: "5px" }}>Danh sách các lớp hiện tại</h2>
      <p style={{ fontWeight: "bold", color: "#333" }}>
        Email giáo viên: {teacherEmail}
      </p>
      <div
        style={{
          maxHeight: "calc(100vh - 30vh)",
          overflowY: "auto",
          padding: 10,
        }}
      >
        {" "}
        {classes.map((cls) => (
          <div key={cls.id} style={classCardStyle}>
            <h3>{cls.className}</h3>
            <p>
              <strong>Mã lớp:</strong> {cls.id}
            </p>
            <p>
              <strong>Số sinh viên:</strong> {cls.numStudent}/
              {cls.numStudentMax}
            </p>
            <p>
              <strong>Số tài liệu:</strong>{" "}
              {cls.docs ? Object.keys(cls.docs).length : 0}
            </p>

            <button
              style={{ marginRight: "5px" }}
              onClick={() => viewClass(cls)}
            >
              Xem
            </button>
            <button
              style={{ marginRight: "5px" }}
              onClick={() => openModal(cls.id)}
            >
              Thêm tài liệu
            </button>
            <button onClick={() => exportClassScoreToExcel(cls)}>
              Tải bảng điểm
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedClass && (
        <AddDocToClassModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          classId={selectedClass}
          teacherEmail={teacherEmail}
        />
      )}

      {isViewModalOpen && selectedClassData && (
        <ClassViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          classData={selectedClassData}
        />
      )}
    </div>
  );
};

export default ClassList;

const classCardStyle = {
  border: "2.5px solid #ddd",
  borderRadius: "8px",
  padding: "15px",
  marginBottom: "10px",
  backgroundColor: "#def1fa",
  boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
  maxWidth: "90vw",
};
