import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UserDetailContext } from "../../context/UserDetailContext";
import { updateDoc, doc as firestoreDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Progress from "react-native-progress";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button";

export default function Quiz() {
  const { docParams } = useLocalSearchParams();
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const doc = useMemo(() => JSON.parse(docParams), [docParams]);
  const quiz = doc?.quiz ?? [];
  const studentId = userDetail?.msv;
  const classRef = useMemo(
    () => firestoreDoc(db, "classes", doc.classId),
    [doc.classId]
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getProgress = useMemo(
    () => currentPage / quiz.length,
    [currentPage, quiz.length]
  );

  const onCheckquizAttempts = async () => {
    if (!doc?.classId || !doc?.docId) {
      console.error("❌ Thiếu classId hoặc docId!");
      setIsLoading(false);
      return false;
    }

    if (!studentId) {
      console.error("❌ Không tìm thấy mã sinh viên!");
      setIsLoading(false);
      return false;
    }

    try {
      const classSnap = await getDoc(classRef);
      if (!classSnap.exists()) {
        console.error("❌ Lớp học không tồn tại!");
        setIsLoading(false);
        return false;
      }

      const classData = classSnap.data();
      const docData = classData?.docs?.[doc.docId] || {};
      const quizAttempts = docData?.[studentId]?.allQuizResult || [];
      const quizCountMax = docData?.[studentId]?.quizCountMax || 1;

      if (quizAttempts.length < quizCountMax) {
        setIsLoading(false);
        return true;
      } else {
        const bestAttempt = quizAttempts.reduce(
          (best, attempt) => {
            const bestScore = parseFloat(best.quizScore);
            const attemptScore = parseFloat(attempt.quizScore);
            return attemptScore > bestScore ? attempt : best;
          },
          { quizScore: -Infinity }
        );

        console.log("🏆 Điểm cao nhất:", bestAttempt.quizScore);

        router.replace({
          pathname: "/quiz/summary",
          params: {
            quizResultParams: JSON.stringify(bestAttempt.quizResult),
            quizScore: bestAttempt.quizScore,
            quizPercScore: bestAttempt.quizPercScore,
            quizCorrectAnswers: bestAttempt.quizCorrectAnswers,
            quizTotalQuestions: bestAttempt.quizTotalQuestions,
            quizReview: true,
          },
        });

        return false;
      }
    } catch (error) {
      console.error("❌ Lỗi khi kiểm tra số lần làm quiz:", error);
      setIsLoading(false);
      return false;
    }
  };

  const onOptionSelect = useCallback(
    (selectedChoice, selectedIndex) => {
      setSelectedOption(selectedIndex);
      setResult((prev) => ({
        ...prev,
        [currentPage]: {
          choiceIndex: selectedIndex,
          userChoise: selectedChoice,
          isCorrect: quiz[currentPage]?.correctAns === selectedChoice,
          question: quiz[currentPage]?.question,
          correctAns: quiz[currentPage]?.correctAns,
        },
      }));
    },
    [currentPage, quiz]
  );

  const onBackToPreQuiz = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
      setSelectedOption(result?.[currentPage - 1]?.choiceIndex ?? null);
    }
  }, [currentPage, result]);

  const onMoveToNextQuiz = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
    setSelectedOption(result?.[currentPage + 1]?.choiceIndex ?? null);
  }, [result]);

  const onQuizFinish = useCallback(async () => {
    setLoading(true);
    try {
      const correctAnswers = Object.values(result).filter(
        (r) => r.isCorrect
      ).length;
      const totalQuestions = quiz.length;
      const score = ((correctAnswers / totalQuestions) * 10).toFixed(2);
      const percScore = ((correctAnswers / totalQuestions) * 100).toFixed(0);

      const classSnap = await getDoc(classRef);
      const classData = classSnap.data();
      const docData = classData?.docs?.[doc.docId] || {};
      const previousResults = docData[studentId]?.allQuizResult || [];

      const updatedQuizResults = [
        ...previousResults,
        {
          quizScore: score,
          quizResult: result,
          quizPercScore: percScore,
          quizCorrectAnswers: correctAnswers,
          quizTotalQuestions: totalQuestions,
          timestamp: new Date().toISOString(),
        },
      ];

      await updateDoc(classRef, {
        [`docs.${doc.docId}.${studentId}.allQuizResult`]: updatedQuizResults,
      });

      console.log("✅ Cập nhật kết quả quiz thành công!");
      onSummary(
        score,
        percScore,
        correctAnswers,
        totalQuestions,
        result,
        false
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật kết quả quiz:", error);
    } finally {
      setLoading(false);
    }
  }, [result, classRef, doc.docId, studentId, quiz.length]);

  const onSummary = useCallback(
    (score, percScore, correctAnswers, totalQuestions, result, isReview) => {
      router.replace({
        pathname: "/quiz/summary",
        params: {
          quizResultParams: JSON.stringify(result),
          quizScore: score,
          quizPercScore: percScore,
          quizCorrectAnswers: correctAnswers,
          quizTotalQuestions: totalQuestions,
          quizReview: isReview,
        },
      });
    },
    [router]
  );

  useEffect(() => {
    onCheckquizAttempts();
  }, [onCheckquizAttempts]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18 }}>Đang tải...</Text>
      </View>
    );
  } else {
    return (
      <View>
        <Image
          source={require("./../../assets/images/wave.png")}
          style={{
            height: 800,
            width: "100%",
          }}
        />
        <View
          style={{
            position: "absolute",
            padding: 25,
            marginTop: 30,
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Pressable
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
              onPress={onBackToPreQuiz}
            >
              <Ionicons
                name="arrow-back-outline"
                size={30}
                color={currentPage > 0 ? Colors.WHITE : Colors.BG_GRAY}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: currentPage > 0 ? Colors.WHITE : Colors.BG_GRAY,
                }}
              >
                Quay lại câu trước
              </Text>
            </Pressable>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 25,
                color: Colors.WHITE,
              }}
            >
              {currentPage + 1} of {quiz?.length}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
            }}
          >
            <Progress.Bar
              progress={getProgress}
              width={Dimensions.get("window").width * 0.85}
              color={Colors.WHITE}
              height={10}
            />
          </View>

          <View
            style={{
              padding: 20,
              backgroundColor: Colors.WHITE,
              marginTop: 20,
              height: Dimensions.get("screen").height * 0.65,
              elevation: 1,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {quiz[currentPage]?.question}
            </Text>
            {quiz[currentPage]?.options.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedOption(index);
                  onOptionSelect(item, index);
                }}
                key={index}
                style={{
                  padding: 20,
                  borderWidth: 1,
                  borderRadius: 15,
                  marginTop: 10,
                  backgroundColor:
                    selectedOption == index ? Colors.LIGHT_GREEN : null,
                  borderColor: selectedOption == index ? Colors.GREEN : null,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedOption?.toString() && quiz?.length - 1 > currentPage && (
            <Button text={"Tiếp theo"} type="fill" onPress={onMoveToNextQuiz} />
          )}
          {selectedOption?.toString() &&
            quiz?.length == Object.keys(result).length && (
              <Button
                text={"Nộp bài"}
                type="fill"
                onPress={() => onQuizFinish()}
                loading={loading}
              />
            )}
        </View>
      </View>
    );
  }
}
