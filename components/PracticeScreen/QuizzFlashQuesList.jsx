import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function QuizzFlashQuesList({ item, option }) {
  const router = useRouter();

  const handleQuizStart = () => {
    if (option?.name == "Kiểm tra") {
      router.push({
        pathname: "/quiz",
        params: {
          docParams: JSON.stringify(item),
        },
      });
    } else if (option?.name == "Flashcards") {
      router.push({
        pathname: "/flashcards",
        params: {
          docParams: JSON.stringify(item),
        },
      });
    } else if (option?.name == "Hỏi đáp") {
      router.push({
        pathname: "/qa",
        params: {
          docParams: JSON.stringify(item),
        },
      });
    }
  };

  const onPress = () => {
    if (option?.name == "Kiểm tra") {
      const attemptCount = item.allQuizResult?.length || 0;
      const maxAttempts = item.quizCountMax || 1;
      let message = "";
      let buttons = [];

      if (attemptCount === 0) {
        message = `Bạn chuẩn bị làm bài kiểm tra ${item.Title}, hãy đảm bảo kết nối mạng của bạn!`;
        buttons = [
          { text: "Ok, làm luôn", onPress: handleQuizStart },
          { text: "Chưa muốn làm", style: "destructive" },
        ];
      } else if (attemptCount < maxAttempts) {
        message = `Điểm cao nhất hiện tại là ${item.quizScore}, bạn muốn làm để cải thiện điểm không?`;
        buttons = [
          { text: "Ok, làm luôn", onPress: handleQuizStart },
          { text: "Chưa muốn làm", style: "destructive" },
        ];
      } else {
        message = `Số lần làm bài kiểm tra này đã hết, bạn sẽ được chuyển đến tổng kết của lần làm bài tốt nhất!`;
        buttons = [{ text: "Oke, tôi hiểu!", onPress: handleQuizStart }];
      }

      Alert.alert("Thông báo", message, buttons);
    } else {
      handleQuizStart();
    }
  };

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 15,
        backgroundColor: Colors.WHITE,
        margin: 7,
        borderRadius: 15,
        elevation: 1,
      }}
      onPress={onPress}
    >
      {option?.name == "Kiểm tra" ? (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={item.quizScore > 4 ? Colors.GREEN : Colors.GRAY}
          style={{
            position: "absolute",
            top: 10,
            left: 15,
          }}
        />
      ) : null}
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={option?.icon}
          style={{
            width: "100%",
            height: 70,
            objectFit: "contain",
          }}
        />
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 7,
            marginBottom: 7,
          }}
        >
          {item.Title}
        </Text>
      </View>

      {option?.name == "Kiểm tra" ? (
        <View>
          <Text
            style={{
              marginTop: 7,
              color: Colors.GRAY,
            }}
          >
            - Điểm số: {item.quizScore}{" "}
          </Text>
          <Text
            style={{
              color: item.quizScore > 4 ? Colors.GREEN : Colors.RED,
            }}
          >
            {"  "}
            {item.quizScore > 4 ? "(Đạt yêu cầu)" : "(Chưa đạt yêu cầu)"}
          </Text>
          <Text
            style={{
              marginTop: 7,
              color: Colors.GRAY,
            }}
          >
            - Số câu hỏi: {item.quiz?.length}
          </Text>
          <Text
            style={{
              marginTop: 7,
              color: Colors.GRAY,
            }}
          >
            - Số lần làm: {item.allQuizResult?.length} / {item.quizCountMax}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
