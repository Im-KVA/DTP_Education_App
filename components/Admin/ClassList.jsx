import React, { useCallback, useEffect, useState } from "react";
import { db } from "../../config/firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query as firestoreQuery,
} from "firebase/firestore";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [teacherNames, setTeacherNames] = useState({});
  const [showAddClass, setShowAddClass] = useState(false);
  const [showEditClass, setShowEditClass] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newClass, setNewClass] = useState({
    className: "",
    classTeacherId: "",
    classId: "",
    numStudentMax: "",
  });

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "classes"));
      const classData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(classData);
    } catch (error) {
      console.error("Lỗi khi tải lớp học:", error);
      alert("Không thể tải danh sách lớp.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const teacherSnapshot = await getDocs(collection(db, "users_teacher"));
      const teacherData = teacherSnapshot.docs.reduce((acc, doc) => {
        acc[doc.data().mgv] = doc.data().name;
        return acc;
      }, {});
      setTeacherNames(teacherData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giáo viên:", error);
      alert("Không thể tải danh sách giáo viên. Vui lòng thử lại!");
    }
  }, []);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, [fetchClasses, fetchTeachers]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      firestoreQuery(collection(db, "classes")),
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClasses(fetched);
      }
    );

    return () => unsubscribe();
  }, []);

  const addClass = async () => {
    const className = newClass.className?.trim();
    const classId = newClass.classId?.trim();
    const classTeacherId = newClass.classTeacherId?.trim();
    const maxStudents = Number(newClass.numStudentMax);

    const isValidInput =
      className &&
      classId &&
      classTeacherId &&
      !isNaN(maxStudents) &&
      maxStudents > 0;

    if (!isValidInput) {
      alert("Vui lòng nhập đầy đủ thông tin lớp học với số sinh viên hợp lệ.");
      return;
    }

    const classData = {
      className,
      classId,
      classTeacherId,
      numStudentMax: maxStudents,
      numStudent: 0,
      status: "open",
      docs: {},
      students: {},
    };

    try {
      const classDocRef = doc(db, "classes", classId);
      await setDoc(classDocRef, classData);

      // setClasses((prev) => [
      //   ...prev,
      //   {
      //     id: classId,
      //     ...classData,
      //   },
      // ]);

      setShowAddClass(false);
    } catch (error) {
      console.error("❌ Lỗi khi thêm lớp:", error);
      alert("Không thể thêm lớp. Vui lòng thử lại!");
    }
  };

  const updateClassStatus = async (classData) => {
    const { id, numStudent, numStudentMax, students } = classData;
    const requiredStudents = Math.ceil((2 / 3) * numStudentMax);

    if (numStudent < requiredStudents) {
      alert("Lớp chưa đủ điều kiện về số lượng sinh viên");
      return;
    }

    const classRef = doc(db, "classes", id);
    const updatedStudents = Object.keys(students).reduce((acc, studentId) => {
      acc[studentId] = true;
      return acc;
    }, {});

    await updateDoc(classRef, {
      status: "closed",
      students: updatedStudents,
    });

    setClasses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "closed", students: updatedStudents } : c
      )
    );
  };

  const reopenClass = async (classData) => {
    const { id, students } = classData;

    const resetStudents = Object.keys(students).reduce((acc, studentId) => {
      acc[studentId] = false;
      return acc;
    }, {});

    const classRef = doc(db, "classes", id);
    await updateDoc(classRef, {
      status: "open",
      students: resetStudents,
    });

    setClasses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "open", students: resetStudents } : c
      )
    );
  };

  const startEditClass = (c) => {
    setEditClass(c);
    setShowEditClass(true);
  };

  const saveEditClass = async () => {
    const maxStudents = Number(editClass.numStudentMax);
    if (!editClass.className || !editClass.classTeacherId || maxStudents <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await updateDoc(doc(db, "classes", editClass.id), {
        className: editClass.className,
        classTeacherId: editClass.classTeacherId,
        numStudentMax: maxStudents,
      });

      setClasses((prev) =>
        prev.map((c) =>
          c.id === editClass.id
            ? { ...c, ...editClass, numStudentMax: maxStudents }
            : c
        )
      );
      setShowEditClass(false);
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa lớp:", error);
      alert("Không thể cập nhật lớp học. Vui lòng thử lại!");
    }
  };

  const deleteClass = async (classId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lớp này không?")) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "classes", classId));
      setClasses((prev) => prev.filter((c) => c.id !== classId));
      setShowEditClass(false);
    } catch (error) {
      console.error("Lỗi khi xóa lớp:", error);
      alert("Không thể xóa lớp. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter((c) => {
    if (filter === "all") return true;
    if (filter === "pending") return c.status === "open";
    if (filter === "approved") return c.status === "closed";
    return false;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={{ marginBottom: "10px" }}>
        {["all", "pending", "approved"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              ...buttonStyle,
              backgroundColor: filter === type ? "#0056b3" : "#007bff",
            }}
          >
            {type === "all"
              ? "Tất cả"
              : type === "pending"
              ? "Chờ xét duyệt"
              : "Đã xét duyệt"}
          </button>
        ))}
        <button
          onClick={() => setShowAddClass(true)}
          style={{ ...buttonStyle, backgroundColor: "green" }}
        >
          Thêm lớp
        </button>

        <button
          onClick={fetchClasses}
          style={{ ...buttonStyle, backgroundColor: "orange" }}
        >
          Làm mới
        </button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}

      <div
        style={{
          overflowY: "auto",
          maxHeight: "calc(100dvh - 30dvh)",
          paddingBottom: "10px",
        }}
      >
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: "left" }}>Tên lớp</th>
              <th style={{ ...thStyle, textAlign: "left" }}>Mã lớp</th>
              <th style={{ ...thStyle, textAlign: "left" }}>Giảng viên</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Số lượng SV</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((c) => (
              <tr key={c.id} style={trStyle}>
                <td style={{ ...tdStyle, textAlign: "left" }}>{c.className}</td>
                <td style={{ ...tdStyle, textAlign: "left" }}>{c.id}</td>
                <td style={{ ...tdStyle, textAlign: "left" }}>
                  {teacherNames[c.classTeacherId] || c.classTeacherId}
                </td>
                <td
                  style={{
                    ...tdStyle,
                    color: c.status === "open" ? "green" : "red",
                    fontStyle: c.status === "closed" ? "italic" : "normal",
                  }}
                >
                  {c.status === "open" ? "Đang mở - Chờ duyệt" : "Lớp đã đóng"}
                </td>
                <td style={tdStyle}>
                  {c.numStudent}/{c.numStudentMax}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => startEditClass(c)}
                    style={{ ...buttonStyle, backgroundColor: "gray" }}
                  >
                    Chỉnh sửa
                  </button>
                  {filter === "pending" && (
                    <button
                      onClick={() => updateClassStatus(c)}
                      style={{
                        ...buttonStyle,
                        backgroundColor:
                          c.numStudent >= Math.ceil((2 / 3) * c.numStudentMax)
                            ? "blue"
                            : "red",
                      }}
                    >
                      Duyệt lớp
                    </button>
                  )}
                  {filter === "approved" && (
                    <button
                      onClick={() => reopenClass(c)}
                      style={{ ...buttonStyle, backgroundColor: "orange" }}
                    >
                      Mở lại lớp
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddClass && (
        <div style={popupStyle}>
          <h3>Thêm lớp học</h3>
          <input
            type="text"
            placeholder="Tên lớp"
            value={newClass.className}
            onChange={(e) =>
              setNewClass({ ...newClass, className: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Mã lớp"
            value={newClass.classId}
            onChange={(e) =>
              setNewClass({ ...newClass, classId: e.target.value })
            }
          />
          <select
            onChange={(e) =>
              setNewClass({ ...newClass, classTeacherId: e.target.value })
            }
          >
            <option value="">Chọn giảng viên</option>
            {Object.entries(teacherNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Số sinh viên tối đa"
            value={newClass.numStudentMax}
            onChange={(e) =>
              setNewClass({ ...newClass, numStudentMax: e.target.value })
            }
          />
          <button
            onClick={addClass}
            style={{ ...buttonStyle, backgroundColor: "blue" }}
          >
            Lưu
          </button>
          <button onClick={() => setShowAddClass(false)} style={buttonStyle}>
            Hủy
          </button>
        </div>
      )}

      {showEditClass && (
        <div style={popupStyle}>
          <h3>Chỉnh sửa lớp học</h3>
          <input
            type="text"
            value={editClass.className}
            onChange={(e) =>
              setEditClass({ ...editClass, className: e.target.value })
            }
          />
          <input
            type="text"
            value={editClass.classId}
            onChange={(e) =>
              setEditClass({ ...editClass, classId: e.target.value })
            }
          />
          <select
            value={editClass.classTeacherId}
            onChange={(e) =>
              setEditClass({ ...editClass, classTeacherId: e.target.value })
            }
          >
            {Object.entries(teacherNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={editClass.numStudentMax}
            onChange={(e) =>
              setEditClass({ ...editClass, numStudentMax: e.target.value })
            }
          />
          <button
            onClick={saveEditClass}
            style={{ ...buttonStyle, backgroundColor: "blue" }}
          >
            Lưu
          </button>
          <button
            onClick={() => deleteClass(editClass.id)}
            style={{ ...buttonStyle, backgroundColor: "red" }}
          >
            Xóa
          </button>
          <button onClick={() => setShowEditClass(false)} style={buttonStyle}>
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  padding: "10px 15px",
  margin: "5px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#ccc",
  color: "white",
  borderRadius: "5px",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};
const thStyle = {
  border: "1px solid black",
  padding: "10px",
  backgroundColor: "#f2f2f2",
};
const tdStyle = {
  border: "1px solid black",
  padding: "10px",
  textAlign: "center",
};
const trStyle = { borderBottom: "1px solid black" };

const popupStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  minWidth: "300px",
};

export default ClassList;
