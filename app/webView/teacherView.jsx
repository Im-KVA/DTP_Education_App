import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../config/firebaseConfig";
import Header from "../../components/TeacherView/Header";
import ClassList from "../../components/TeacherView/ClassList";
import DocList from "../../components/TeacherView/DocList";

const TeacherView = () => {
  const [view, setView] = useState("classes");
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const teacherRef = doc(db, "users_teacher", user.email);
        try {
          const teacherSnap = await getDoc(teacherRef);
          if (teacherSnap.exists()) {
            setTeacherInfo(teacherSnap.data());
          } else {
            console.error("Không tìm thấy giáo viên trong Firestore!");
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu giáo viên:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Người dùng chưa đăng nhập!");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Đang tải dữ liệu giáo viên...</p>;
  if (!teacherInfo) return <p>Không có thông tin giáo viên!</p>;

  return (
    <div>
      <h1>Giao diện giáo viên</h1>
      <Header setView={setView} />
      {view === "classes" ? (
        <ClassList
          teacherId={teacherInfo.mgv}
          teacherEmail={teacherInfo.email}
        />
      ) : (
        <DocList teacherId={teacherInfo.email} />
      )}
    </div>
  );
};

export default TeacherView;
