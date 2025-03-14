import { View, Text } from "react-native";
import React, { useContext } from "react";
import { UserDetailContext } from "./../../context/UserDetailContext";

export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <View>
      <View></View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 25,
        }}
      >
        Xin chào, {userDetail?.msv}
      </Text>

      <Text
        style={{
          fontSize: 17,
        }}
      >
        Bắt đầu theo dõi quá trình học!
      </Text>
    </View>
  );
}
