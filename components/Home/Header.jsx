import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { UserDetailContext } from "./../../context/UserDetailContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";

export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 25,
      }}
    >
      <View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 25,
            color: Colors.LIGHT_GREEN,
          }}
        >
          Xin chào, {userDetail?.name}
        </Text>
        <Text
          style={{
            fontSize: 15,
            marginTop: 5,
            color: Colors.GRAY,
          }}
        >
          Học nào!
        </Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/classStudentList")}>
        <AntDesign name="book" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}
