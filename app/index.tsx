import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "./../constant/Colors";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { UserDetailContext } from "./../context/UserDetailContext";
import React, { useState, useContext } from "react";

export default function Index() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        const result = await getDoc(doc(db, "users", user.email));
        setUserDetail(result.data());
        router.replace("./(tabs)/home");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../assets/images/landing.png")}
        style={{
          width: "100%",
          height: 300,
          marginTop: 70,
        }}
      />

      <View
        style={{
          padding: 25,
          backgroundColor: Colors.PRIMARY,
          height: "100%",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Chào mừng tới ứng dụng Quản lý học tập
        </Text>

        <Text
          style={{
            fontSize: 15,
            marginTop: 20,
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Quản lý thông tin sinh viên. Quản lý quá trình học tập. Quản lý bài
          giảng và ghi chép.{"\n"}
          {"\n"}🧑‍🎓 TẤT CẢ TRONG MỘT!! 🤖
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/signIn")}
        >
          <Text style={styles.buttonText}>Bắt đầu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          //onPress={() => router.push("/auth/")}
          style={[
            styles.button,
            {
              backgroundColor: Colors.PRIMARY,
              borderWidth: 1,
              borderColor: Colors.WHITE,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            Đăng nhập bằng NFC
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 18,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.PRIMARY,
    fontSize: 18,
    //fontWeight: "bold",
  },
});
