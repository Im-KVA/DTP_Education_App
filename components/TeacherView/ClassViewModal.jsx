import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const ClassViewModal = ({ isOpen, onClose, classData }) => {
  const [docTitles, setDocTitles] = useState({});
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !classData) return;

    const fetchDetails = async () => {
      setLoading(true);

      try {
        // Lấy tên tài liệu
        const docMap = classData.docs || {};
        const docIds = Object.keys(docMap);
        const docTitlesTemp = {};
        for (const docId of docIds) {
          const docSnap = await getDoc(doc(db, "docs", docId));
          if (docSnap.exists()) {
            docTitlesTemp[docId] = docSnap.data().Title || "Không tên";
          }
        }
        setDocTitles(docTitlesTemp);

        // Lấy thông tin sinh viên
        const studentsMap = classData.students || {};
        const studentEmails = Object.keys(studentsMap);
        const studentInfoList = [];

        for (const email of studentEmails) {
          const studentSnap = await getDoc(doc(db, "users", email));
          if (studentSnap.exists()) {
            const student = studentSnap.data();
            const studentScoreData = [];

            for (const docId of docIds) {
              const docData = classData.docs[docId];
              const quizCountMax = docData.quizCountMax || 1;
              const quizResults = docData[student.msv]?.allQuizResult || [];

              const bestScore =
                quizResults.length > 0
                  ? Math.max(...quizResults.map((q) => q.quizScore || 0))
                  : "-";

              studentScoreData.push({
                docTitle: docTitlesTemp[docId],
                bestScore,
              });
            }

            studentInfoList.push({
              name: student.name,
              msv: student.msv,
              scores: studentScoreData,
            });
          }
        }

        setStudentData(studentInfoList);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết lớp:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, classData]);

  if (!isOpen) return null;

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={{ float: "right" }}>
          Đóng
        </button>
        <h2 style={{ fontWeight: "bold", fontSize: "24px" }}>
          {classData.className}
        </h2>
        <h3>
          <strong>Số lượng học sinh:</strong> {classData.numStudent}/
          {classData.numStudentMax}
        </h3>

        <h3>Tài liệu</h3>
        <ul>
          {Object.keys(docTitles).length === 0 ? (
            <li>
              <i style={{ color: "red" }}>Chưa có tài liệu</i>
            </li>
          ) : (
            Object.entries(docTitles).map(([id, Title]) => (
              <li key={id}>{Title}</li>
            ))
          )}
        </ul>

        <h3>Bảng điểm</h3>
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {loading ? (
            <p>Đang tải bảng điểm...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Họ và tên</th>
                    <th style={thTdStyle}>Mã sinh viên</th>
                    <th style={thTdStyle}>Điểm số</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student, idx) => (
                    <tr key={idx}>
                      <td style={thTdStyle}>{student.name}</td>
                      <td style={thTdStyle}>{student.msv}</td>
                      <td style={thTdStyle}>
                        <ul style={{ paddingLeft: "20px", margin: 0 }}>
                          {student.scores.length === 0 ? (
                            <li>
                              <i style={{ color: "red" }}>
                                Chưa có danh sách điểm
                              </i>
                            </li>
                          ) : (
                            student.scores.map((s, i) => (
                              <li key={i}>
                                Lần {i + 1} - {s.docTitle}:{" "}
                                {s.bestScore === "-" ? (
                                  <i style={{ color: "red" }}>Chưa làm bài</i>
                                ) : (
                                  s.bestScore + " Điểm"
                                )}
                              </li>
                            ))
                          )}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassViewModal;

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "600px",
};

const thTdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
  verticalAlign: "top",
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
};
