import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { UserDetailContext } from "./../../context/UserDetailContext";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
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
            fontSize: 20,
          }}
        >
          Xin chào, {userDetail?.msv}
        </Text>
        <Text
          style={{
            fontSize: 15,
            marginTop: 5,
          }}
        >
          Học nào!
        </Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="settings-outline" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}
