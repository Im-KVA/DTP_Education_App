import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import AddDocModal from "./AddDocModal";

const ClassList = ({ teacherId, teacherEmail }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "classes"));
        const classData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((c) => c.classTeacherId === teacherId);
        setClasses(classData);
      } catch (error) {
        console.error("Lỗi tải danh sách lớp:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

  const openModal = (classId) => {
    setSelectedClass(classId);
    setIsModalOpen(true);
  };

  if (loading) return <p>Đang tải...</p>;
  if (classes.length === 0) return <p>Không có lớp học nào.</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "5px" }}>Giao diện giáo viên</h2>
      <p style={{ fontWeight: "bold", color: "#333" }}>{teacherId}</p>

      {classes.map((cls) => (
        <div key={cls.id} style={classCardStyle}>
          <h3>{cls.className}</h3>
          <p>
            <strong>Mã lớp:</strong> {cls.id}
          </p>
          <p>
            <strong>Số sinh viên:</strong> {cls.numStudent}/{cls.numStudentMax}
          </p>
          <p>
            <strong>Số tài liệu:</strong>{" "}
            {cls.docs ? Object.keys(cls.docs).length : 0}
          </p>

          <button
            style={{ marginRight: "5px" }}
            onClick={() => console.log("Xem lớp:", cls.id)}
          >
            Xem
          </button>
          <button
            style={{ marginRight: "5px" }}
            onClick={() => openModal(cls.id)}
          >
            Thêm tài liệu
          </button>
          <button onClick={() => console.log("Tải bảng điểm:", cls.id)}>
            Tải bảng điểm
          </button>
        </div>
      ))}

      {isModalOpen && selectedClass && (
        <AddDocModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          classId={selectedClass}
          teacherEmail={teacherEmail}
        />
      )}
    </div>
  );
};

export default ClassList;

const classCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "15px",
  marginBottom: "10px",
  backgroundColor: "#f9f9f9",
  boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
};
