import { View, Text } from "react-native";
import React, { useState } from "react";
import ClassList from "../../components/Admin/ClassList";
import Header from "../../components/Admin/Header";
import StudentList from "../../components/Admin/StudentList";
import TeacherList from "../../components/Admin/TeacherList";

export default function Admin() {
  const [view, setView] = useState("classes");

  return (
    <div>
      <Header setView={setView} />
      {view === "classes" ? (
        <ClassList />
      ) : view === "students" ? (
        <StudentList />
      ) : view === "teachers" ? (
        <TeacherList />
      ) : null}
    </div>
  );
}
