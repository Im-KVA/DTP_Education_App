import { View, Text, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Home/Header";
import Colors from "../../constant/Colors";
import NoClass from "../../components/Home/NoClass";
import { UserDetailContext } from "../../context/UserDetailContext";
import { collection, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import ClassList from "../../components/Home/ClassList";

export default function Home() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    userDetail && GetClassList();
  }, [userDetail]);

  const GetClassList = async () => {
    const q = query(
      collection(db, "Class"),
      where("createdBy", "==", userDetail?.email)
    );
    const querySnapshot = await getDoc(q);

    querySnapshot.foreach((doc) => {
      console.log("--", doc.data());
      setClassList((prev) => [...prev, doc.data()]);
    });
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: Platform.OS == "ios" && 45,
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Header />
      {classList?.length == 0 ? <NoClass /> : <ClassList />}
    </View>
  );
}
