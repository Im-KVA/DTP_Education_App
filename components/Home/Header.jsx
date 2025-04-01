import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { UserDetailContext } from "./../../context/UserDetailContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constant/Colors";

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
      <TouchableOpacity>
        <Ionicons name="settings-outline" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}
