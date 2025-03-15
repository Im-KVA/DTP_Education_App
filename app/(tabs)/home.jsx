import { View, Text, Platform, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Home/Header";
import Colors from "../../constant/Colors";
import NoDoc from "../../components/Home/NoDoc";
import DocList from "../../components/Home/DocList";
import Practice from "../../components/Home/Practice";
import { UserDetailContext } from "../../context/UserDetailContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import LearnProgress from "../../components/Home/LearnProgress";

export default function Home() {
  const { userDetail } = useContext(UserDetailContext);
  const [docList, setDocList] = useState([]);

  useEffect(() => {
    if (userDetail) {
      GetDocList();
    }
  }, [userDetail]);

  const GetDocList = async () => {
    try {
      const q = query(
        collection(db, "docs"),
        where("createBy", "==", userDetail?.email)
      );
      const querySnapshot = await getDocs(q);

      const docsArray = [];
      querySnapshot.forEach((doc) => {
        console.log("--", doc.data());
        docsArray.push(doc.data());
      });

      setDocList(docsArray);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài liệu:", error);
    }
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: Platform.OS === "ios" ? 45 : 25,
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Header />
      {docList.length === 0 ? (
        <NoDoc />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 5,
          }}
        >
          <LearnProgress docList={docList} />
          <Practice />
          <DocList docList={docList} />
        </ScrollView>
      )}
    </View>
  );
}
