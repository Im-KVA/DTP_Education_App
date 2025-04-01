import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function QuestionAnswer() {
  const { docParams } = useLocalSearchParams();
  const doc = JSON.parse(docParams);
  const qaList = doc?.qa;
  const router = useRouter();

  const [selectedQuestion, setSelectedQuestion] = useState();

  const onQuestionSelect = (index) => {
    if (selectedQuestion == index) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(index);
    }
  };

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
          width: "100%",
          padding: 20,
          marginTop: 55,
        }}
      >
        <Pressable
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={30} color={Colors.WHITE} />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 28,
              color: Colors.WHITE,
            }}
          >
            Câu hỏi ôn tập
          </Text>
        </Pressable>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: Colors.WHITE,
            }}
          >
            Bài giảng:{" "}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: Colors.WHITE,
              flexWrap: "wrap",
            }}
          >
            {doc?.Title}
          </Text>
        </View>

        <FlatList
          data={qaList}
          style={{
            height: Dimensions.get("screen").height * 0.8,
            marginTop: 10,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.card}
              onPress={() => onQuestionSelect(index)}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                {item?.question}
              </Text>
              {selectedQuestion == index && (
                <View
                  style={{
                    borderTopWidth: 0.4,
                    margin: 5,
                    marginVertical: 10,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: Colors.GRAY,
                      }}
                    >
                      Trả lời:{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: Colors.GREEN,
                        textAlign: "justify",
                        flex: 1,
                      }}
                    >
                      {item.answer}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 10,
    borderRadius: 15,
    elevation: 1,
  },
});
