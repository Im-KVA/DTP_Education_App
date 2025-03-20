import { View, ScrollView, Platform, RefreshControl } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Header from "../../components/Home/Header";
import Colors from "../../constant/Colors";
import NoDoc from "../../components/Home/NoDoc";
import DocList from "../../components/Home/DocList";
import Practice from "../../components/Home/Practice";
import { UserDetailContext } from "../../context/UserDetailContext";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import LearnProgress from "../../components/Home/LearnProgress";

export default function Home() {
  const { userDetail } = useContext(UserDetailContext);
  const [classIdList, setClassIdList] = useState([]);
  const [docIdList, setDocIdList] = useState([]);
  const [docList, setDocList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userDetail) {
      getClassIdList();
    }
  }, [userDetail]);

  useEffect(() => {
    if (classIdList.length > 0) {
      getDocIdList();
    }
  }, [classIdList]);

  useEffect(() => {
    if (docIdList.length > 0) {
      getDocList();
    }
  }, [docIdList]);

  // Bước 1: Lấy danh sách ID của lớp học mà sinh viên đã đăng ký
  const getClassIdList = async () => {
    try {
      if (!userDetail?.email) return;

      const studentEmail = userDetail.email;
      const classesRef = collection(db, "classes");

      console.log("🔍 Đang lấy toàn bộ danh sách lớp...");
      const classSnapshot = await getDocs(classesRef);

      const classIds = [];
      classSnapshot.forEach((doc) => {
        const classData = doc.data();
        if (classData.students && classData.students[studentEmail]) {
          classIds.push(doc.id);
        }
      });

      console.log("✅ Danh sách lớp lấy được:", classIds);
      setClassIdList(classIds);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách lớp:", error);
    }
  };

  // Bước 2: Từ danh sách lớp, lấy danh sách ID tài liệu từ field `docs`
  const getDocIdList = async () => {
    try {
      console.log("🔍 Đang lấy danh sách ID tài liệu từ các lớp:", classIdList);

      const docListWithClass = [];

      for (const classId of classIdList) {
        const classRef = doc(db, "classes", classId);
        const classSnap = await getDoc(classRef);

        if (classSnap.exists()) {
          const classData = classSnap.data();
          if (classData.docs && typeof classData.docs === "object") {
            Object.keys(classData.docs).forEach((docId) => {
              docListWithClass.push({ docId, classId });
            });
          }
        }
      }

      console.log(
        "✅ Danh sách tài liệu kèm classId lấy được:",
        docListWithClass
      );
      setDocIdList(docListWithClass);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách ID tài liệu:", error);
    }
  };

  // Bước 3: Từ danh sách ID tài liệu, lấy nội dung tài liệu từ collection `docs`
  const getDocList = async () => {
    try {
      console.log("🔍 Đang lấy nội dung tài liệu từ danh sách ID:", docIdList);

      const docsArray = [];

      for (const { docId, classId } of docIdList) {
        const docSnap = await getDoc(doc(db, "docs", docId));
        if (!docSnap.exists()) continue;

        docsArray.push({
          id: docId,
          classId: classId,
          ...docSnap.data(),
        });
      }

      console.log("✅ Đã lấy được danh sách tài liệu");
      setDocList(docsArray);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách tài liệu:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getClassIdList();
    await getDocIdList();
    await getDocList();
    setRefreshing(false);
  }, []);

  return (
    <View
      style={{
        padding: 25,
        paddingTop: Platform.OS === "ios" ? 45 : 25,
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Header />
      {docList.length === 0 ? (
        <NoDoc />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 5,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <LearnProgress docList={docList} />
          <Practice />
          <DocList docList={docList} />
        </ScrollView>
      )}
    </View>
  );
}
