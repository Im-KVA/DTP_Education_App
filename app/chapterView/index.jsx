import { View, Text, Dimensions, StyleSheet } from "react-native";
import React, { useState, useContext } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../config/firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import * as Progress from "react-native-progress";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function ChapterView() {
  const { chapterParams, chapterIndex, chapterDocId, chapterClassId } =
    useLocalSearchParams();
  const { userDetail } = useContext(UserDetailContext);
  const chapters = JSON.parse(chapterParams);
  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const GetProgress = (currentPage) => {
    return currentPage / chapters?.content?.length;
  };

  const onChapterComplete = async () => {
    console.log("🔍 Debug: msv =", userDetail.msv);
    console.log("🔍 Debug: classId =", chapterClassId);
    console.log("🔍 Debug: docId =", chapterDocId);
    console.log("🔍 Debug: chapterIndex =", chapterIndex);

    if (!userDetail?.msv || !chapterClassId || !chapterDocId) {
      console.error("Thiếu thông tin cần thiết để cập nhật chương hoàn thành!");
      return;
    }

    setLoader(true);
    try {
      const docRef = doc(db, "classes", chapterClassId);

      await updateDoc(docRef, {
        [`docs.${chapterDocId}.${userDetail.msv}.completedChapters`]:
          arrayUnion(chapterIndex),
      });

      console.log(
        `✅ Đã cập nhật completedChapters cho ${userDetail.msv} tại lớp ${chapterClassId}, tài liệu ${chapterDocId}`
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật chương hoàn thành:", error);
    }

    setLoader(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={GetProgress(currentPage)}
        width={Dimensions.get("screen").width * 0.85}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.topicText}>
          {chapters?.content[currentPage].topic}
        </Text>
        <Text style={styles.explainText}>
          {chapters?.content[currentPage]?.explain}
        </Text>

        {chapters?.content[currentPage]?.code && (
          <Text style={[styles.codeExampleText, styles.codeBlock]}>
            {chapters?.content[currentPage]?.code}
          </Text>
        )}

        {chapters?.content[currentPage]?.example && (
          <Text style={styles.codeExampleText}>
            {chapters?.content[currentPage]?.example}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {currentPage < chapters?.content?.length - 1 ? (
          <Button
            text={"Tiếp theo"}
            onPress={() => setCurrentPage(currentPage + 1)}
            type="fill"
          />
        ) : (
          <Button
            text={"Hoàn thành"}
            onPress={onChapterComplete}
            type="fill"
            loading={loader}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    marginTop: 30,
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  contentContainer: {
    marginTop: 10,
  },
  topicText: {
    fontWeight: "bold",
    fontSize: 25,
  },
  explainText: {
    fontSize: 15,
    marginTop: 5,
  },
  codeExampleText: {
    padding: 15,
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 15,
    fontSize: 12,
    marginTop: 15,
  },
  codeBlock: {
    backgroundColor: Colors.BLACK,
    color: Colors.WHITE,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 25,
    width: "100%",
    left: 25,
  },
});
