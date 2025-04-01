import { View, Text, FlatList, Image } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { imageAssets } from "../../constant/Option";
import Colors from "../../constant/Colors";
import * as Progress from "react-native-progress";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getDoc, doc as firestoreDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function LearnProgress({ docList }) {
  const { userDetail } = useContext(UserDetailContext);
  const [completedProgress, setCompletedProgress] = useState({});

  useEffect(() => {
    if (docList.length > 0 && userDetail) {
      getCompletedChaptersProgress();
    }
  }, [docList, userDetail]);

  const getCompletedChaptersProgress = async () => {
    if (!userDetail?.msv) return;

    try {
      const progressData = {};
      for (const docItem of docList) {
        const { classId, id: docId, chapters } = docItem;

        const classSnap = await getDoc(firestoreDoc(db, "classes", classId));
        if (!classSnap.exists()) continue;

        const classData = classSnap.data();
        const studentId = userDetail.msv;
        let completedChapters = [];

        if (
          classData.docs &&
          classData.docs[docId] &&
          classData.docs[docId][studentId] &&
          classData.docs[docId][studentId].completedChapters
        ) {
          completedChapters =
            classData.docs[docId][studentId].completedChapters;
        }

        const totalChapters = chapters?.length || 1;
        const completionRate = completedChapters.length / totalChapters;

        progressData[docId] = {
          completed: completedChapters.length,
          total: totalChapters,
          progress: completionRate,
        };
      }

      console.log("✅ Lấy tiến trình học tập");
      setCompletedProgress(progressData);
    } catch (error) {
      console.error("❌ Lỗi khi lấy tiến trình học tập:", error);
    }
  };

  return (
    <View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 25,
          margin: 10,
          color: Colors.WHITE,
        }}
      >
        Tiến trình học tập
      </Text>

      <FlatList
        data={docList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const progressInfo = completedProgress[item.id] || {
            completed: 0,
            total: item.chapters?.length || 1,
            progress: 0,
          };

          return (
            <View
              style={{
                margin: 7,
                padding: 7,
                backgroundColor: Colors.BG_GRAY,
                borderRadius: 15,
                width: 250,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <Image
                  source={imageAssets[item?.banner_image]}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    flexShrink: 1,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    {item?.Title}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {progressInfo.total} Chương
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Progress.Bar progress={progressInfo.progress} width={230} />

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <MaterialCommunityIcons
                    name="file-document-edit-outline"
                    size={15}
                    color="black"
                  />
                  <Text>
                    {" "}
                    Hoàn thành {progressInfo.completed}/{progressInfo.total}{" "}
                    chương
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
