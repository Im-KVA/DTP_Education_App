import {
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PracticeOption } from "../../../constant/Option";
import Colors from "../../../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import QuizzFlashQuesList from "../../../components/PracticeScreen/QuizzFlashQuesList";
import { UserDetailContext } from "../../../context/UserDetailContext";

export default function PracticeTypeHomeScreen() {
  const { userDetail } = useContext(UserDetailContext);
  const { type, classId } = useLocalSearchParams();
  const option = PracticeOption.find((item) => item.name == type);
  const router = useRouter();
  const [docQuizzList, setDocQuizzList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllDocQuizzes = async () => {
    try {
      console.log("🔍 Đang lấy danh sách tài liệu từ Firestore...");

      const classesRef = classId
        ? doc(db, "classes", classId)
        : collection(db, "classes");

      const classSnapshot = classId
        ? [await getDoc(classesRef)]
        : await getDocs(classesRef);

      const docPromises = [];

      classSnapshot.forEach((classDoc) => {
        const classData = classDoc.data();
        const classId = classDoc.id;
        const className = classData.className || "Chưa đặt tên";

        if (classData.docs && typeof classData.docs === "object") {
          Object.keys(classData.docs).forEach((docId) => {
            docPromises.push(
              (async () => {
                const docRef = doc(db, "docs", docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                  const docData = docSnap.data();
                  const studentMsv = userDetail?.msv;
                  const quizResults =
                    classData.docs[docId]?.[studentMsv]?.allQuizResult || [];
                  const quizCountMax =
                    classData.docs[docId]?.[studentMsv]?.quizCountMax || 1;

                  // Tìm lần làm có điểm cao nhất
                  const bestAttempt = quizResults.reduce(
                    (best, attempt) => {
                      const bestScore = parseFloat(best.quizScore);
                      const attemptScore = parseFloat(attempt.quizScore);
                      return attemptScore > bestScore ? attempt : best;
                    },
                    { quizScore: -Infinity }
                  );

                  return {
                    docId,
                    classId,
                    className,
                    quizScore: bestAttempt.quizScore,
                    allQuizResult: quizResults,
                    quizCountMax,
                    ...docData,
                  };
                }
                return null;
              })()
            );
          });
        }
      });

      const docQuizzArray = (await Promise.all(docPromises)).filter(Boolean);
      console.log("✅ Danh sách tài liệu: quizz, flashcards, qa");
      setDocQuizzList(docQuizzArray);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách tài liệu:", error);
    }
  };

  useEffect(() => {
    fetchAllDocQuizzes();
    onRefresh();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllDocQuizzes();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => (
    <QuizzFlashQuesList item={item} option={option} />
  );

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={option.image}
        style={{
          height: 200,
          width: "100%",
          marginTop: 50,
        }}
      />
      <View
        style={{
          position: "absolute",
          padding: 10,
          marginTop: 50,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            size={30}
            color={Colors.WHITE}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 35,
              color: Colors.WHITE,
            }}
          >
            {type}
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={docQuizzList}
        keyExtractor={(item) => item.docId}
        numColumns={2}
        style={{ flex: 1, padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderItem}
      />
    </View>
  );
}
