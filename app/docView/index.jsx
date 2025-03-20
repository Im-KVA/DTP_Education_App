import { View, FlatList } from "react-native";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { doc as firestoreDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Intro from "../../components/DocView/Intro";
import Chapters from "../../components/DocView/Chapters";
import Colors from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function DocView() {
  const { docParams, docId, classId } = useLocalSearchParams();
  const doc = JSON.parse(docParams);
  const { userDetail } = useContext(UserDetailContext);
  const [completedChapters, setCompletedChapters] = useState([]);

  const fetchCompletedChapters = async () => {
    if (!userDetail || !userDetail.msv) return;

    try {
      const classSnap = await getDoc(firestoreDoc(db, "classes", classId));
      if (classSnap.exists()) {
        const classData = classSnap.data();
        const studentId = userDetail.msv;

        if (
          classData.docs &&
          classData.docs[docId] &&
          classData.docs[docId][studentId] &&
          classData.docs[docId][studentId].completedChapters
        ) {
          setCompletedChapters((prev) => {
            const newChapters =
              classData.docs[docId][studentId].completedChapters;
            console.log(
              "📌 Số chương hoàn thành (đã cập nhật trong setState):",
              newChapters
            );
            return newChapters;
          });
        }
      }
    } catch (error) {
      console.error("❌ Error fetching completedChapters:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchCompletedChapters();
      };
      fetchData();
    }, [docId, classId, userDetail])
  );

  return (
    <FlatList
      data={[]}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={
        <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
          <Intro doc={doc} />
          <Chapters
            doc={doc}
            docId={docId}
            classId={classId}
            completedChapters={completedChapters}
          />
        </View>
      }
    />
  );
}
