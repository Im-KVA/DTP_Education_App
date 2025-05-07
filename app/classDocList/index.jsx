import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import DocList from "../../components/Home/DocList";
import Practice from "../../components/Home/Practice";
import Colors from "../../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ClassDocList() {
  const { classId, className } = useLocalSearchParams();
  const [docList, setDocList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      fetchDocs();
    }
  }, [classId]);

  const fetchDocs = async () => {
    try {
      const classSnap = await getDoc(doc(db, "classes", classId));
      if (!classSnap.exists()) return;

      const classData = classSnap.data();
      const docIds = Object.keys(classData.docs || {});
      const fetchedDocs = [];

      for (const docId of docIds) {
        const docSnap = await getDoc(doc(db, "docs", docId));
        if (docSnap.exists()) {
          fetchedDocs.push({
            id: docId,
            classId: classId,
            ...docSnap.data(),
          });
        }
      }

      setDocList(fetchedDocs);
    } catch (error) {
      console.error("❌ Lỗi khi lấy tài liệu lớp học:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Image
        source={require("../../assets/images/wave-home.png")}
        style={{
          position: "absolute",
          height: 500,
          width: "100%",
          zIndex: -1,
        }}
      />
      <View
        style={{
          backgroundColor: Colors.WHITE + "AA",
          marginTop: 50,
          padding: 20,
        }}
      >
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back-outline"
            size={30}
            color={Colors.WHITE}
          />
          <Text
            style={{ fontSize: 32, fontWeight: "bold", color: Colors.WHITE }}
          >
            Nội dung lớp: {className || classId}
          </Text>
        </TouchableOpacity>

        {docList.length === 0 ? (
          <Text style={{ marginHorizontal: 20, color: "gray" }}>
            Lớp này chưa có tài liệu nào.
          </Text>
        ) : (
          <ScrollView>
            <DocList docList={docList} />
            <Practice classId={classId} />
          </ScrollView>
        )}
      </View>
    </View>
  );
}
