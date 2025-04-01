import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button";

export default function QuizSummary() {
  const router = useRouter();

  const {
    quizResultParams,
    quizScore,
    quizPercScore,
    quizCorrectAnswers,
    quizTotalQuestions,
    quizReview,
  } = useLocalSearchParams();
  const quizResult = JSON.parse(quizResultParams);
  console.log(quizReview);

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("./../../assets/images/wave-home.png")}
        style={{
          width: "100%",
          height: 700,
          position: "absolute",
        }}
      />
      <View
        style={{
          width: "100%",
          padding: 35,
          marginTop: 30,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 30,
            color: Colors.WHITE,
          }}
        >
          Kết Quả Bài Làm
        </Text>
        <View
          style={{
            backgroundColor: Colors.WHITE,
            padding: 20,
            borderRadius: 20,
            marginTop: 60,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            source={require("./../../assets/images/trophy.png")}
            style={{
              width: 100,
              height: 100,
              marginTop: -60,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Điểm số: {quizScore}
          </Text>
          <Text
            style={{
              color: Colors.GRAY,
              fontSize: 17,
              marginTop: 5,
              textAlign: "center",
            }}
          >
            Bạn trả lời đúng {quizPercScore}% số câu hỏi
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultText}>
                Số câu: {quizTotalQuestions}
              </Text>
            </View>
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultText}>✅: {quizCorrectAnswers} </Text>
            </View>
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultText}>
                ❌: {quizTotalQuestions - quizCorrectAnswers}
              </Text>
            </View>
          </View>
        </View>
        <Button
          text={"Kết thúc và quay về"}
          onPress={() => router.back()}
          type={"fill"}
        />
        <View
          style={{
            marginTop: 20,
          }}
        >
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 25,
              }}
            >
              Tổng kết:{" "}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.GRAY,
              }}
            >
              {quizReview == "true"
                ? "(Đây là lần làm bài có số điểm cao nhất)"
                : null}
            </Text>
          </View>

          <View style={{ maxHeight: 340 }}>
            <FlatList
              data={Object.entries(quizResult)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const quizItem = item[1];
                return (
                  <View
                    style={{
                      padding: 15,
                      borderWidth: 1.5,
                      marginTop: 5,
                      borderRadius: 10,
                      backgroundColor: quizItem?.isCorrect
                        ? Colors.LIGHT_GREEN
                        : Colors.LIGHT_RED,
                      borderColor: quizItem?.isCorrect
                        ? Colors.GREEN
                        : Colors.RED,
                    }}
                  >
                    <Text style={{ fontSize: 15 }}>{quizItem.question}</Text>
                    <Text style={{ marginTop: 5, color: Colors.GRAY }}>
                      Đáp án: {quizItem?.correctAns}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultTextContainer: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    elevation: 1,
  },
  resultText: {
    fontSize: 20,
  },
});
