import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button";
import { genTopicAIModel, genDocsAIModel } from "../../config/modelGemini";
import Prompt from "../../constant/Prompt";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import { useRouter } from "expo-router";

function extractCleanJson(text) {
  // Tìm đoạn JSON trong khối ```json ... ```
  const match = text.match(/```json([\s\S]*?)```/i);
  if (match) return match[1].trim();

  // Nếu không có block ```json```, thử tìm đoạn bắt đầu bằng [
  const firstBracket = text.indexOf("[");
  if (firstBracket !== -1) return text.substring(firstBracket).trim();

  throw new Error("Không tìm thấy JSON hợp lệ trong phản hồi.");
}

export default function AddDocWithAI() {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const router = useRouter();

  console.log(userDetail?.email);

  const onAIGenTopic = async () => {
    setLoading(true);
    //Create Topic from Gemini AI
    const PROMPT = userInput + Prompt.IDEA;
    const aiResp = await genTopicAIModel.sendMessage(PROMPT);
    const responseText = aiResp.response.text();
    console.log("Raw AI response:", responseText);

    const cleanJson = extractCleanJson(responseText);
    const topicIdea = JSON.parse(cleanJson);
    console.log(topicIdea);

    setTopics(topicIdea);
    setLoading(false);
  };

  const onTopicSelect = (topic) => {
    const isExist = selectedTopics.find((item) => item == topic);
    if (!isExist) {
      setSelectedTopics((prev) => [...prev, topic]);
    } else {
      const topics = selectedTopics.filter((item) => item !== topic);
      setSelectedTopics(topics);
    }
  };

  const isTopicSelected = (topic) => {
    const selection = selectedTopics.find((item) => item == topic);
    return selection ? true : false;
  };

  const onGenDocs = async () => {
    setLoading(true);
    const PROMPT = selectedTopics.join(", ") + Prompt.DOC;

    try {
      const aiResp = await genDocsAIModel.sendMessage(PROMPT);
      const responseText = aiResp.response.text();
      console.log("Raw AI Response:", responseText);

      const cleanJson = extractCleanJson(responseText);
      const resp = JSON.parse(cleanJson);

      if (!resp || !resp.docs) {
        throw new Error("Invalid response format: docs field is missing");
      }

      const docs = resp.docs;
      console.log("Docs generated:", docs);

      // Lưu vào Firebase
      for (const docData of docs) {
        if (!userDetail?.email) {
          console.error("Email người dùng không tồn tại! Hủy lưu dữ liệu.");
          setLoading(false);
          return;
        }

        await setDoc(doc(db, "docs", Date.now().toString()), {
          ...docData,
          createOn: new Date(),
          createBy: userDetail?.email,
        });
        console.log("Đã lưu vào Firebase:", docData);
      }

      router.push("../webView/teacherView");
      setLoading(false);
    } catch (e) {
      console.error("Error generating docs:", e);
      setLoading(false);
    }
  };

  return (
    <ScrollView
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
        Tạo khung bài giảng với AI (Kiến thức từ AI chỉ nên dùng để tham khảo)
      </Text>

      <Text
        style={{
          fontSize: 30,
          marginTop: 5,
        }}
      >
        Thêm bài giảng mới
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
        text={"Tạo nội dung bài giảng"}
        type="outline"
        onPress={onAIGenTopic}
        loading={loading}
      />

      <View>
        <Text
          style={{
            fontSize: 20,
            marginTop: 8,
          }}
        >
          Chọn nội dung thêm vào bài giảng
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 6,
          }}
        >
          {topics.map((item, index) => (
            <Pressable key={index} onPress={() => onTopicSelect(item)}>
              <Text
                style={{
                  padding: 7,
                  borderWidth: 0.4,
                  borderRadius: 99,
                  paddingHorizontal: 15,
                  backgroundColor: isTopicSelected(item)
                    ? Colors.PRIMARY
                    : null,
                  color: isTopicSelected(item) ? Colors.WHITE : Colors.PRIMARY,
                }}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {selectedTopics?.length > 0 && (
        <Button
          text="Tạo các bài giảng"
          type="fill"
          onPress={() => onGenDocs()}
          loading={loading}
        />
      )}
    </ScrollView>
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
