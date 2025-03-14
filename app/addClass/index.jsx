import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button";
import { genTopicAIModel } from "../../config/modelGeminiFlash2.0Pro";
import Prompt from "../../constant/Prompt";

export default function AddClass() {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState();
  const onAIGenTopic = async () => {
    setLoading(true);
    //Create Topic from AI
    const PROMPT = userInput + Prompt.IDEA;
    const aiResp = await genTopicAIModel.sendMessage(PROMPT);
    const topicIdea = aiResp.response.text();
    console.log(topicIdea);
    setLoading(false);
  };
  return (
    <View
      style={{
        padding: 25,
        backgroundColor: Colors.WHITE,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 30,
          marginTop: 30,
        }}
      >
        Tạo Lớp Học Mới
      </Text>

      <Text
        style={{
          fontSize: 30,
          marginTop: 5,
        }}
      >
        Thêm bài giảng cho sinh viên?
      </Text>

      <Text
        style={{
          fontSize: 20,
          marginTop: 8,
          color: Colors.GRAY,
        }}
      >
        Bài giảng bạn muốn tạo là gì?
      </Text>

      <TextInput
        placeholder="Vd: Python Cơ bản, C++ Cơ bản..."
        style={styles.textInput}
        numberOfLines={3}
        onChangeText={(value) => setUserInput(value)}
      />

      <Button
        text={"Tạo bài giảng"}
        type="outline"
        onPress={onAIGenTopic}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 80,
    marginTop: 15,
    alignItems: "flex-start",
    fontSize: 15,
  },
});
